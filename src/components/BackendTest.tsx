import { useEffect, useState } from "react";

type BackendFile = {
  id: number;
  name: string;
  type: string;
};

export default function BackendTest() {
  const [files, setFiles] = useState<BackendFile[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/files")
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error("Backend error:", error));
  }, []);

  return (
    <div>
      <h2>Backend Files</h2>

      {files.map((file) => (
        <p key={file.id}>
          {file.name} - {file.type}
        </p>
      ))}
    </div>
  );
}