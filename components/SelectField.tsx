import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { SelectFieldProps } from "@/types"
import { Label } from "./ui/label"

const SelectField = ({ label, selectOptions, selectedItem, setSelectedItem, error }: SelectFieldProps) => {
    return (
        <div className="flex flex-col gap-2 w-full md:w-1/4">
            <Label>{label}</Label>

            <Select
                // {...selectProps}
                defaultValue={selectedItem[0].toString()}
                onValueChange={setSelectedItem}
            >
                <SelectTrigger className="w-full border-gray-400">
                    <SelectValue placeholder="None selected" />
                </SelectTrigger>
                <SelectContent>
                    {selectOptions()}
                </SelectContent>
            </Select>
            {error?.message && (
                <p className="text-xs text-red-400">{error.message.toString()}</p>
            )}
        </div>

    )
}

export default SelectField