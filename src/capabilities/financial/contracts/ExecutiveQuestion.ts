export interface ExecutiveQuestion {
    id: string;
    question: string;
    context: string;
    originSignalId: string;
    intent: "understand" | "evaluate" | "investigate";
}
