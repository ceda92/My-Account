import { cn } from "../MyAccount/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-dark-blue/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
