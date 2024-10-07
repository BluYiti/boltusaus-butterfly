"use client";

import { convertFileToUrl } from "@/lib/utils";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (fles: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="upload"
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-blue-300">Click to upload </span>
              or drag and drop
            </p>
            <p>Supported image formats: PDF, PNG, JPG, or SVG</p>
          </div>
        </>
      )}
      {isDragActive ? (
        <p>↓ Drop the files here ↓</p>
      ) : (
        <p>Maximum upload file size: 100MB</p>
      )}
    </div>
  );
};

export default FileUploader;
