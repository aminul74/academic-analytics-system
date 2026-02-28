import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`cursor-pointer rounded bg-sky-600 px-3 py-2 text-white ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}
