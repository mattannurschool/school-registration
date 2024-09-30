// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 p-4">
      <div className="text-center text-white">
        <p>
          &copy; {new Date().getFullYear()} GHSS Mattannur. All rights reserved.
        </p>
        <p>
          Powered by{" "}
          <strong>
            <a
              href="https://instagram.com/your-company-instagram"
              className="underline-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code cave media
            </a>
          </strong>{" "}
          | Developed by{" "}
          <strong>
            <a
              href="https://instagram.com/your-instagram"
              className="underline-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              Muhammed irshad ismail
            </a>
          </strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
