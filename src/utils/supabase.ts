
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for database tables
export interface QuestionDB {
  id?: string;
  title?: string;
  image_url?: string;
  category?: string;
  updated_at?: string;
  created_at?: string;
}

export interface AnswerDB {
  id?: string;
  question_id: string;
  title: string;
  content: Array<{
    shape: string;
    number: number;
    color: string;
  }>;
  type?: string;
  is_correct: boolean;
  created_at?: string;
  updated_at?: string;
}

// Function to save a question with its answers
export async function saveQuestionWithAnswers(questionData: {
  id: string;
  title: string;
  imageUrl?: string;
  answers: Array<{
    id: string;
    isCorrect: boolean;
    blocks: Array<{
      shape: string;
      number: number;
      color: string;
    }>;
  }>;
}) {
  try {
    // First, save the question
    const { data: questionResult, error: questionError } = await supabase
      .from('question')
      .insert({
        id: questionData.id,
        title: questionData.title,
        image_url: questionData.imageUrl || null,
        category: 'recognize_object'
      })
      .select()
      .single();

    if (questionError) {
      throw questionError;
    }

    // Then, save all the answers
    const answersToInsert = questionData.answers.map((answer, index) => ({
      question_id: questionData.id,
      title: `Answer ${index + 1}`,
      content: answer.blocks,
      type: 'single_choice',
      is_correct: answer.isCorrect
    }));

    const { data: answersResult, error: answersError } = await supabase
      .from('answer')
      .insert(answersToInsert)
      .select();

    if (answersError) {
      throw answersError;
    }

    return {
      question: questionResult,
      answers: answersResult,
      success: true
    };

  } catch (error) {
    console.error('Error saving question with answers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to update an existing question with its answers
export async function updateQuestionWithAnswers(questionData: {
  id: string;
  title: string;
  imageUrl?: string;
  answers: Array<{
    id: string;
    isCorrect: boolean;
    blocks: Array<{
      shape: string;
      number: number;
      color: string;
    }>;
  }>;
}) {
  try {
    // Update the question
    const { data: questionResult, error: questionError } = await supabase
      .from('question')
      .update({
        title: questionData.title,
        image_url: questionData.imageUrl || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', questionData.id)
      .select()
      .single();

    if (questionError) {
      throw questionError;
    }

    // Delete existing answers
    const { error: deleteError } = await supabase
      .from('answer')
      .delete()
      .eq('question_id', questionData.id);

    if (deleteError) {
      throw deleteError;
    }

    // Insert new answers
    const answersToInsert = questionData.answers.map((answer, index) => ({
      question_id: questionData.id,
      title: `Answer ${index + 1}`,
      content: answer.blocks,
      type: 'single_choice',
      is_correct: answer.isCorrect
    }));

    const { data: answersResult, error: answersError } = await supabase
      .from('answer')
      .insert(answersToInsert)
      .select();

    if (answersError) {
      throw answersError;
    }

    return {
      question: questionResult,
      answers: answersResult,
      success: true
    };

  } catch (error) {
    console.error('Error updating question with answers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to fetch all questions without their answers
export async function fetchQuestions() {
  try {
    const { data: questions, error: questionsError } = await supabase
      .from('question')
      .select('*')
      .order('created_at', { ascending: false });

    if (questionsError) {
      throw questionsError;
    }

    return {
      questions,
      success: true
    };

  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to fetch a single question by ID without answers
export async function fetchQuestionById(questionId: string) {
  try {
    const { data: question, error: questionError } = await supabase
      .from('question')
      .select('*')
      .eq('id', questionId)
      .single();

    if (questionError) {
      throw questionError;
    }

    return {
      question,
      success: true
    };

  } catch (error) {
    console.error('Error fetching question by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to fetch questions with pagination (without answers)
export async function fetchQuestionsWithPagination(
  page: number = 1,
  pageSize: number = 10,
  category?: string
) {
  try {
    let query = supabase
      .from('question')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    // Add category filter if provided
    if (category) {
      query = query.eq('category', category);
    }

    const { data: questions, error: questionsError, count } = await query;

    if (questionsError) {
      throw questionsError;
    }

    return {
      questions,
      totalCount: count || 0,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
      success: true
    };

  } catch (error) {
    console.error('Error fetching questions with pagination:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to fetch answers for a specific question
export async function fetchAnswersByQuestionId(questionId: string) {
  try {
    const { data: answers, error: answersError } = await supabase
      .from('answer')
      .select('*')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true });

    if (answersError) {
      throw answersError;
    }

    return {
      answers: answers || [],
      success: true
    };

  } catch (error) {
    console.error('Error fetching answers by question ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to fetch all questions with their answers
export async function fetchQuestionsWithAnswers() {
  try {
    const { data: questions, error: questionsError } = await supabase
      .from('question')
      .select(`
        *,
        answer (*)
      `)
      .order('created_at', { ascending: false });

    if (questionsError) {
      throw questionsError;
    }

    return {
      questions: questions || [],
      success: true
    };

  } catch (error) {
    console.error('Error fetching questions with answers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to fetch a single question with its answers (optimized for modal)
export async function fetchQuestionWithAnswersById(questionId: string) {
  try {
    const { data: question, error: questionError } = await supabase
      .from('question')
      .select(`
        *,
        answer (*)
      `)
      .eq('id', questionId)
      .single();

    if (questionError) {
      throw questionError;
    }

    return {
      question,
      success: true
    };

  } catch (error) {
    console.error('Error fetching question with answers by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function to delete a question and its answers
export async function deleteQuestionWithAnswers(questionId: string) {
  try {
    // Delete answers first (due to foreign key constraint)
    const { error: answersError } = await supabase
      .from('answer')
      .delete()
      .eq('question_id', questionId);

    if (answersError) {
      throw answersError;
    }

    // Then delete the question
    const { error: questionError } = await supabase
      .from('question')
      .delete()
      .eq('id', questionId);

    if (questionError) {
      throw questionError;
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Error deleting question with answers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}