import { cn } from "@/lib/utils";
import { ChevronDown, ChevronDownIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  MULTI_SELECT = "multiSelect",
}

interface InputFieldProps {
  control: any;
  fieldType: FormFieldType;
  type?: React.HTMLInputTypeAttribute;
  label: string;
  name: string;
  containerClassName?: string;
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  children?: React.ReactNode;
  disabled?: boolean;

  options?: {
    id: string;
    name: string;
  }[];
}

const InputField = ({
  label,
  type = "text",
  control,
  name,
  fieldType,
  containerClassName,
  disabled = false,
  options,
  placeholder,
  children,
  inputProps,
}: InputFieldProps) => {
  const [visible, setVisible] = useState(false);
  const [inputType, setInputType] = useState(type);
  const [open, setOpen] = useState(false);

  const toggleVisibility = (value: boolean) => {
    setVisible(value);

    if (value) {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };

  const renderField = (field: ControllerRenderProps<FieldValues, string>) => {
    switch (fieldType) {
      case FormFieldType.INPUT:
        return (
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                value={
                  typeof field.value === "object" && field.value !== null
                    ? field.value.name
                    : field.value || ""
                }
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4"
                {...inputProps}
              />

              {type === "password" && (
                <div className="absolute top-1/2 right-2 w-4 -translate-y-1/2 cursor-pointer bg-white">
                  {visible ? (
                    <EyeOff
                      color="#99a1af"
                      onClick={() => toggleVisibility(false)}
                      size={18}
                    />
                  ) : (
                    <Eye
                      color="#99a1af"
                      onClick={() => toggleVisibility(true)}
                      size={18}
                    />
                  )}
                </div>
              )}
            </div>
          </FormControl>
        );
      case FormFieldType.TEXTAREA:
        return (
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              className="custom-scrollbar w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            />
          </FormControl>
        );
      case FormFieldType.SELECT:
        return (
          <Select
            value={field.value ?? ""}
            defaultValue={field.value}
            onValueChange={(val) => field.onChange(val || "")}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            {children}
          </Select>
        );
      case FormFieldType.MULTI_SELECT:
        const selectedOptions = field?.value
          ? field?.value
              ?.map((v: string) => options?.find((o) => o.id === v))
              .filter(Boolean)
          : [];

        const value = Array.isArray(field.value) ? field.value : [];

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                disabled={disabled}
                className={cn(
                  "line-clamp-1 flex w-full items-center justify-between rounded-md p-2 text-sm text-ellipsis text-gray-700 ring-[1.5px] ring-gray-300",
                  selectedOptions.length === 0 && "text-gray-400",
                )}
              >
                {selectedOptions.length > 0
                  ? selectedOptions.map((opt: any) => opt?.name).join(", ")
                  : placeholder}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[9999] max-h-56 w-[430px]! overflow-y-scroll p-2 px-4">
              <FormControl>
                <div className="flex flex-col gap-2">
                  {options?.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={value.includes(opt.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...value, opt.id])
                            : field.onChange(
                                value.filter((v: string) => v !== opt.id),
                              );
                        }}
                      />

                      <span>{opt.name}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
            </PopoverContent>
          </Popover>
        );
      case FormFieldType.DATE_PICKER:
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="flex w-full items-center justify-between rounded-md p-2 text-sm text-gray-700 ring-[1.5px] ring-gray-300"
                >
                  {field.value
                    ? field.value.toLocaleDateString()
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent className="z-[9999] w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                captionLayout="dropdown"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
                // minD
              />
            </PopoverContent>
          </Popover>
        );
      case FormFieldType.CHECKBOX:
        return (
          <FormControl>
            <div className="flex items-center gap-3">
              <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor={name}>{label}</Label>
            </div>
          </FormControl>
        );
      case FormFieldType.RADIO:
        return (
          <FormControl>
            <RadioGroup
              value={field.value ?? ""}
              defaultValue={field.value}
              onValueChange={(val) => field.onChange(val || "")}
              disabled={disabled}
            >
              {options?.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.id} id={opt.id} />
                  <Label htmlFor={opt.id} className="capitalize">
                    {opt.name}
                  </Label>
                </div>
              ))}
              {children}
            </RadioGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const fieldsWithoutLabels = [FormFieldType.CHECKBOX];

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem
          className={cn("flex w-full flex-col gap-2", containerClassName)}
        >
          {!fieldsWithoutLabels.includes(fieldType) && (
            <FormLabel htmlFor={name} className="text-sm text-gray-700">
              {label}
            </FormLabel>
          )}

          {renderField(field)}

          <FormMessage className="text-xs text-red-400" />
        </FormItem>
      )}
    ></FormField>
  );
};

export default InputField;
