import { useEffect, useState } from "react";
import { Image, Video, FolderTree, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { notify } from "@/utils/notify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    portfolioItems: 0,
    images: 0,
    videos: 0,
    categories: 0,
    services: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [items, categories, services] = await Promise.all([
          api.getPortfolioItems(),
          api.getCategories(),
          api.getServices(),
        ]);

        const list = items?.results || [];
        const imageCount = list.reduce(
          (sum, item) => sum + (item.pictures?.length || 0),
          0
        );
        const videoCount = list.reduce(
          (sum, item) => sum + (item.videos?.length || 0),
          0
        );

        setStats({
          portfolioItems: items?.count || list.length,
          images: imageCount,
          videos: videoCount,
          categories: categories.length,
          services: services.length,
        });
      } catch (error) {
        notify({
          title: "Error",
          description: "Failed to load dashboard stats.",
          variant: "destructive",
        });
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Portfolio Items",
      value: stats.portfolioItems,
      icon: Image,
      color: "text-primary",
    },
    {
      title: "Pictures",
      value: stats.images,
      icon: Image,
      color: "text-accent",
    },
    {
      title: "Videos",
      value: stats.videos,
      icon: Video,
      color: "text-purple-500",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: FolderTree,
      color: "text-green-500",
    },
    {
      title: "Services",
      value: stats.services,
      icon: Briefcase,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
