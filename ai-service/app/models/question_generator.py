from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import re

class QuestionGenerator:
    def __init__(self):
        self.model_name = "google/flan-t5-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)

    def generate(self, product_info: dict, num_questions: int = 5) -> list:
        name = product_info.get("name", "product")
        description = product_info.get("description", "")
        category = product_info.get("category", "")
        base_prompt = (
             f"You are an AI assistant that helps improve product transparency.\n"
    f"Based on the *specific details of the product below*, generate a unique and insightful follow-up question that has not been asked before.\n"
    f"The question must be directly related to this product’s characteristics like description , product name and category.\n"
    f"It should encourage deeper understanding, trust, or accountability.\n\n"
    f"Product Name: {name}\n"
        )
        if description:
            base_prompt += f"Description: {description}\n"
        if category:
            base_prompt += f"Category: {category}\n"
        base_prompt += "Question:"

        questions = set()
        tries = 0
        max_tries = num_questions * 5  # More tries for more unique questions

        while len(questions) < num_questions and tries < max_tries:
            inputs = self.tokenizer(base_prompt, return_tensors="pt")
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=64,
                do_sample=True,
                top_k=50,
                top_p=0.95,
                temperature=0.85,
                num_return_sequences=1
            )
            output_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            question = output_text.split("Question:")[-1].strip()
            if question and question not in questions:
                questions.add(question)
            tries += 1

        # If still not enough, fill with a generic question
        while len(questions) < num_questions:
            questions.add(f"Can you provide more information about {name}?")
        return list(questions)