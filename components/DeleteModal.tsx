import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Table } from "@/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { deleteAssignment, deleteClass, deleteExam, deleteLesson, deleteParent, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/actions"

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
    result: deleteSubject,
    attendance: deleteSubject,
    event: deleteSubject,
    announcement: deleteSubject,
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
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this {table} and remove all data from the servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleDelete}
                        className="bg-red-400 hover:bg-red-500 text-black px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2"
                    >
                        {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteModal
