// components/Container.tsx  (or put it in a utils/layout file)
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-5 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}