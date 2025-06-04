export interface Poll {
  id: number;
  title: string;
  description: string;
  allowsMultipleAnswers: boolean;
  isClosed: boolean;
  createdByUserId: number;
  options: {
    id: number;
    text: string;
    voteCount: number;
  }[];
}
