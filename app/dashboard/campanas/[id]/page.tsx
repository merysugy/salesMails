import { CampaignDetailView } from "@/components/campaign-detail-view";

type Props = Readonly<{
  params: Promise<Readonly<{ id: string }>>;
}>;

export default async function CampanaDetailPage({ params }: Props) {
  const { id } = await params;
  return <CampaignDetailView campanaId={Number(id)} />;
}
