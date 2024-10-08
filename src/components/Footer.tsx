// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 p-4">
      <div className="text-center text-white">
        <p className="max-sm:text-[12px]">
          &copy; {new Date().getFullYear()} MTS GUPS MATTANNUR. All rights
          reserved.
        </p>
        <p className="mt-3 max-w-[780px] mx-auto max-sm:text-sm">
          Madhusoodanan Thangal Smaraka Govt U P School, MATTANNUR. PO MATTANNUR
          670702, MATTANNUR Sub District.
        </p>
        <p className="mt-3">
          Powered by{" "}
          <strong>
            <a
              href="https://www.instagram.com/codecave.in/"
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
              href="https://www.linkedin.com/in/muhammed-irshad-81985b287/"
              className="underline-none "
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
