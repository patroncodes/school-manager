import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Eye, Megaphone } from "lucide-react";

type MessageBoardProps = {
  type: "announcement" | "event";
  title: string;
  description: string;
  date: string;
};

const MessageBoard = ({
  type,
  title,
  description,
  date,
}: MessageBoardProps) => {
  const icon =
    type === "announcement" ? (
      <Megaphone className="h-8 w-8 text-indigo-500" />
    ) : (
      <Calendar className="h-8 w-8 text-green-500" />
    );

  return (
    <Dialog>
      <DialogTrigger className="flex-center rounded-full bg-lamaSky p-0.5">
        <Eye className="h-5 w-5" />
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-2xl bg-gradient-to-b from-white to-gray-200 shadow-xl">
        <DialogHeader className="flex flex-col gap-2">
          {icon}

          <div className="flex-center flex-col gap-1">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
            <p className="text-sm text-gray-600">{date}</p>
          </div>
        </DialogHeader>

        <DialogDescription className="mt-4 text-base text-gray-900">
          {description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default MessageBoard;
