import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportGenerationForm from '../../components/reports/ReportGenerationForm';

/**
 * Generate Report Page
 * Page for generating a new report for a specific product
 */
const GenerateReportPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [productName, setProductName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setError('Product ID is required');
        setIsLoading(false);
        return;
      }

      try {
        // In a real application, you would fetch product details from an API
        // For now, we'll just simulate a product name
        setProductName(`Product ${productId}`);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (isLoading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate(-1)} className="button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="page-container generate-report-page">
      <div className="page-header">
        <h1>Generate Report</h1>
        <p>Create a new report for {productName}</p>
      </div>
      <div className="page-content">
        {productId && <ReportGenerationForm productId={productId} productName={productName} />}
      </div>
    </div>
  );
};

export default GenerateReportPage;