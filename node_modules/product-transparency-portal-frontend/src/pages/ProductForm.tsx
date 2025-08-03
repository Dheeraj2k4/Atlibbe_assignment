import jsPDF from 'jspdf';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { productApi, aiApi } from '../services/api';
import { FormValues, Product, Question, GenerateQuestionsRequest } from '../types';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const FormTitle = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const FormDescription = styled.p`
  color: ${({ theme }) => theme.colors.lightText};
  font-size: 1.125rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const basicFields: Question[] = [
  {
    id: 'name',
    question_text: 'Product Name',
    question_type: 'text',
    required: true,
  },
  {
    id: 'description',
    question_text: 'Product Description',
    question_type: 'text',
    required: true,
    tooltip: 'Provide a detailed description of your product, including its purpose and benefits.',
  },
  {
    id: 'category',
    question_text: 'Product Category',
    question_type: 'select',
    required: true,
    options: [
      { value: 'supplements', label: 'Supplements' },
      { value: 'food', label: 'Food & Beverage' },
      { value: 'cosmetics', label: 'Cosmetics' },
      { value: 'personal_care', label: 'Personal Care' },
      { value: 'household', label: 'Household Products' },
      { value: 'other', label: 'Other' },
    ],
  },
];

const initialBasicValues: FormValues = {
  name: '',
  description: '',
  category: '',
};

const basicValidation = Yup.object({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Product description is required'),
  category: Yup.string().required('Product category is required'),
});

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState<Product | null>(null);
  const [aiQuestions, setAiQuestions] = useState<Question[]>([]);

  const handleBasicSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setIsLoading(true);
    setLoadingMessage('Generating AI questions...');

    try {
      const product: Product = {
        name: values.name,
        description: values.description,
        category: values.category,
        ingredients: '',
        manufacturing_location: '',
        certifications: [],
        additional_info: {},
      };

      setProductData(product);

      const generateRequest: GenerateQuestionsRequest = {
        product: product,
        num_questions: 5
      };

      const aiResponse = await aiApi.generateQuestions(generateRequest);

      if (aiResponse.success && aiResponse.data) {
        const questions: Question[] = aiResponse.data.questions.map((questionText, index) => ({
          id: `q_${index}`,
          question_text: questionText,
          question_type: 'text',
          required: false,
          is_ai_generated: true
        }));

        setAiQuestions(questions);
        setCurrentStep(2);
      } else {
        alert(`Error: ${aiResponse.error || 'Failed to generate questions. Please try again.'}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while generating questions.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleQuestionsSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    if (!productData) {
      alert('Product data is missing. Please go back and try again.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Submitting data and generating transparency report...');

    try {
      const answeredQuestions: Question[] = aiQuestions.map((q) => ({
        question_text: q.question_text,
        answer: values[q.id!] || '',
        question_type: q.question_type,
        is_ai_generated: true,
        required: q.required ?? false,
      }));

      const productPayload = {
        ...productData,
        questions: answeredQuestions,
      };

      const response = await productApi.createProduct(productPayload);

      if (response.success && 'data' in response) {
        const createdProduct = response.data as Product & { _id: string };

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Product Transparency Report', 20, 20);

        doc.setFontSize(12);
        doc.text(`Name: ${createdProduct.name}`, 20, 40);
        doc.text(`Description: ${createdProduct.description}`, 20, 50);
        doc.text(`Category: ${createdProduct.category}`, 20, 60);

        let y = 80;
        answeredQuestions.forEach(({ question_text, answer }) => {
          doc.text(`${question_text}: ${answer}`, 20, y);
          y += 10;
        });

        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');

        navigate(`/product/${createdProduct._id}`);
      } else {
        alert(`Error: ${response.error || 'Failed to submit product'}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting the product.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const initialQuestionsValues = useMemo(() => {
    const values: FormValues = {};
    aiQuestions.forEach(question => {
      values[question.id!] = '';
    });
    return values;
  }, [aiQuestions]);

  return (
    <div className="container">
      <FormContainer>
        <FormHeader>
          <FormTitle>Product Submission Form</FormTitle>
          <FormDescription>
            {currentStep === 1 
              ? 'Complete the form below to generate AI questions about your product.'
              : 'Please answer the following AI-generated questions about your product.'}
          </FormDescription>
        </FormHeader>

        {currentStep === 1 ? (
          <Formik
            initialValues={initialBasicValues}
            validationSchema={basicValidation}
            onSubmit={handleBasicSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isSubmitting }) => (
              <Form>
                {basicFields.map((field) => (
                  <FormField
                    key={field.id}
                    label={field.question_text}
                    name={field.id!}
                    type={field.question_type === 'select' ? 'select' : 'text'}
                    options={
                      Array.isArray(field.options)
                        ? field.options.map((option) =>
                            typeof option === 'string'
                              ? { value: option, label: option }
                              : option
                          )
                        : undefined
                    }
                    tooltip={field.tooltip}
                    required={field.required}
                  />
                ))}
                <FormActions>
                  <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                    Next
                  </Button>
                </FormActions>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={initialQuestionsValues}
            onSubmit={handleQuestionsSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isSubmitting }) => (
              <Form>
                {aiQuestions.map((question) => (
                  <FormField
                    key={question.id}
                    label={question.question_text}
                    name={question.id!}
                    type="textarea"
                    required={question.required}
                  />
                ))}
                <FormActions>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                    Submit
                  </Button>
                </FormActions>
              </Form>
            )}
          </Formik>
        )}

        {isLoading && (
          <LoadingOverlay>
            <Spinner />
            <p>{loadingMessage}</p>
          </LoadingOverlay>
        )}
      </FormContainer>
    </div>
  );
};

export default ProductForm;
