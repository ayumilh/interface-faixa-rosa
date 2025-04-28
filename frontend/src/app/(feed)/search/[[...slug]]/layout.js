import { generateMetadata } from "./metadata";

export { generateMetadata };


export default function SearchLayout({ children }) {
    return (
      <div className="bg-white text-black min-h-screen">
        {children}
      </div>
    );
  }
  