import { cn } from "@/lib/utils";
import { InputFieldProps } from "@/types";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  containerClassName,
  error,
  inputProps
}: InputFieldProps) => {
  const [visible, setVisible] = useState(false)
  const [inputType, setInputType] = useState(type)

  const toggleVisibility = (value: boolean) => {
    setVisible(value)

    if (value) {
      setInputType('text')
    } else {
      setInputType('password')
    }
  }

  return (
    <div className={cn("flex flex-col gap-2 w-full md:w-1/4", containerClassName)}>
      <label htmlFor={name} className="text-sm text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          name={name}
          {...register(name)}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...inputProps}
          defaultValue={defaultValue}
        />

        {type === 'password' && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-white w-4">
            {visible
              ? <EyeOff
                color="#99a1af"
                onClick={() => toggleVisibility(false)}
                size={18}
              />
              : <Eye
                color="#99a1af"
                onClick={() => toggleVisibility(true)}
                size={18}
              />
            }
          </div>
        )}
      </div>


      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
