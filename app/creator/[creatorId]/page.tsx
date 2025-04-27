import StreamView from "@/app/components/StreamView";

type ParamsType = Promise<{ creatorId: string }>;

export default async function CreatorPage({
  params,
}: {
  params: ParamsType;
}) {
  const { creatorId } = await params;

  return (
    <div>
      <StreamView creatorId={creatorId} playVideo={false} />
    </div>
  );
}
