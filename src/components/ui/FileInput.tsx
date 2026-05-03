import { ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

type FileInputProps = Omit<ComponentPropsWithoutRef<"input">, "type">;

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ onChange, ...rest }, ref) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        setPreview(URL.createObjectURL(file));
      } else {
        setFileName(null);
        setPreview(null);
      }
      onChange?.(e);
    };

    return (
      <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-fuchsia-300 bg-fuchsia-50 p-4 py-2 transition-all hover:border-fuchsia-500 hover:bg-fuchsia-100">
        <input
          type="file"
          ref={ref}
          className="hidden"
          onChange={handleChange}
          {...rest}
        />
        {preview ? (
          <div className="flex w-full items-center gap-2">
            <img
              src={preview}
              alt="preview"
              className="max-h-40 rounded-lg object-cover shadow-sm"
            />
            <span className="text-xs text-fuchsia-400">{fileName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 py-2">
            <AiOutlineCloudUpload className="size-8 text-fuchsia-400 transition-transform group-hover:scale-110" />
            <span className="text-sm font-semibold text-fuchsia-600">이미지 업로드</span>
          </div>
        )}
      </label>
    );
  }
);

FileInput.displayName = "FileInput";

export default FileInput;
