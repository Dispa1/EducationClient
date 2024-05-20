// react-quiz.d.ts

declare module 'react-quiz' {
    export interface QuizQuestion {
        id: string;
        question: string;
        options: QuizOption[];
        correctAnswer: number | number[];
    }

    export interface QuizOption {
        text: string;
        // Add any other properties specific to the answer option
    }

    export interface QuizProps {
        quiz: QuizQuestion[];
        // Add any other props if needed
    }

    export default function Quiz(props: QuizProps): JSX.Element;
}
