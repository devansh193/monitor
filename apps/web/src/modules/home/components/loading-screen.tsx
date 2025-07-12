import { TextShimmer } from '@repo/ui/components/text-shimmer';

export const LoadingScreen = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <TextShimmer duration={1} className="text-lg tracking-wider">
        Loading...
      </TextShimmer>
    </div>
  );
};
