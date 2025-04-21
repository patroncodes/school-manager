import { deleteAnnouncement, deleteAssignment, deleteClass, deleteEvent, deleteExam, deleteLesson, deleteParent, deleteResult, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/actions";
import { Table } from "@/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

type DeleteModalProps = {
    id: string | number
    table: Table
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

const deleteActionMap = {
    subject: deleteSubject,
    class: deleteClass,
    teacher: deleteTeacher,
    student: deleteStudent,
    exam: deleteExam,
    assignment: deleteAssignment,
    lesson: deleteLesson,
    parent: deleteParent,
    result: deleteResult,
    event: deleteEvent,
    announcement: deleteAnnouncement,
    attendance: deleteSubject,
};

const DeleteModal = ({ id, table, open, setOpen }: DeleteModalProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const result = await deleteActionMap[table](id.toString());

            if (result.success) {
                toast.success(`${table} deleted successfully.`);
                router.refresh();

                setOpen(false);
            } else {
                toast.error(typeof result.error == 'string' ? result.error : `Failed to delete ${table}`)
            }
        } catch {
            toast.error(`An unexpected error occurred.`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete this {table} and remove all data from the servers.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleDelete}
                        className="bg-red-400 hover:bg-red-500 text-black px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2"
                    >
                        {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteModal
