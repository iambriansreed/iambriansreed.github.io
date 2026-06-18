declare global {
    interface Window {
        onSubmitMessage?: (token: string) => Promise<void>;
        onSubmitQuiz?: (token: string) => Promise<void>;
    }
}

export {};
