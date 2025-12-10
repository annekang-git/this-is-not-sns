import Feed from '@/components/Feed';
import Composer from '@/components/Composer';

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28 pt-4">
      <Feed />
      <Composer />
    </div>
  );
}
