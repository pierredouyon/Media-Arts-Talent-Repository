import { useState } from "react";
import { motion } from "framer-motion";
import { User, Image, BarChart2, Edit2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  useGetUser,
  useUpdateUser,
  useGetUserMedia,
  useDeleteMedia,
  getGetUserQueryKey,
  getGetUserMediaQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const DEMO_USER_ID = 1;

export default function DashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: loadingUser } = useGetUser(DEMO_USER_ID, {
    query: { enabled: true, queryKey: getGetUserQueryKey(DEMO_USER_ID) },
  });

  const { data: media, isLoading: loadingMedia } = useGetUserMedia(DEMO_USER_ID, {
    query: { queryKey: getGetUserMediaQueryKey(DEMO_USER_ID) },
  });

  const updateUser = useUpdateUser();
  const deleteMedia = useDeleteMedia();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    jobTitle: "",
    city: "Windsor",
    province: "ON",
    website: "",
  });

  const startEdit = () => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio ?? "",
        jobTitle: user.jobTitle ?? "",
        city: user.city,
        province: user.province,
        website: user.website ?? "",
      });
    }
    setEditing(true);
  };

  const saveProfile = async () => {
    try {
      await updateUser.mutateAsync({ id: DEMO_USER_ID, data: form });
      queryClient.invalidateQueries({ queryKey: getGetUserQueryKey(DEMO_USER_ID) });
      toast({ title: "Profile updated!" });
      setEditing(false);
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  const handleDeleteMedia = async (id: number) => {
    try {
      await deleteMedia.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getGetUserMediaQueryKey(DEMO_USER_ID) });
      toast({ title: "Media deleted" });
    } catch {
      toast({ title: "Failed to delete media", variant: "destructive" });
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-black text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black mb-1">Dashboard</h1>
          <p className="text-white/50">Manage your MATR profile</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500 mb-6">No profile found. Please sign in or create an account.</p>
            <Button className="bg-[#E50914] hover:bg-[#b40710] text-white font-semibold rounded-xl">
              Sign In
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="profile">
            <TabsList className="mb-6 bg-white rounded-xl p-1 border border-gray-200">
              <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white">
                <User size={15} className="mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="media" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white">
                <Image size={15} className="mr-2" />
                Media
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-black data-[state=active]:text-white">
                <BarChart2 size={15} className="mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-black text-xl">Your Profile</h2>
                  {!editing ? (
                    <Button
                      onClick={startEdit}
                      variant="outline"
                      className="rounded-xl gap-2"
                      data-testid="button-edit-profile"
                    >
                      <Edit2 size={15} />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditing(false)}
                        className="rounded-xl"
                        data-testid="button-cancel-edit"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveProfile}
                        disabled={updateUser.isPending}
                        className="bg-[#E50914] hover:bg-[#b40710] text-white rounded-xl"
                        data-testid="button-save-profile"
                      >
                        {updateUser.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold">First Name</Label>
                        <Input
                          value={form.firstName}
                          onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                          className="mt-1 rounded-xl"
                          data-testid="input-edit-first-name"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Last Name</Label>
                        <Input
                          value={form.lastName}
                          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                          className="mt-1 rounded-xl"
                          data-testid="input-edit-last-name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Job Title</Label>
                      <Input
                        value={form.jobTitle}
                        onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
                        className="mt-1 rounded-xl"
                        data-testid="input-edit-job-title"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Bio</Label>
                      <Textarea
                        value={form.bio}
                        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                        className="mt-1 rounded-xl min-h-[100px]"
                        data-testid="textarea-edit-bio"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Website</Label>
                      <Input
                        value={form.website}
                        onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                        className="mt-1 rounded-xl"
                        data-testid="input-edit-website"
                      />
                    </div>
                  </div>
                ) : (
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wider mb-1">Name</dt>
                      <dd className="font-semibold text-black" data-testid="text-profile-name">
                        {user.firstName} {user.lastName}
                      </dd>
                    </div>
                    {user.jobTitle && (
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wider mb-1">Title</dt>
                        <dd className="font-semibold text-black" data-testid="text-profile-title">{user.jobTitle}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</dt>
                      <dd className="font-semibold text-black" data-testid="text-profile-email">{user.email}</dd>
                    </div>
                    {user.bio && (
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bio</dt>
                        <dd className="text-gray-600 text-sm leading-relaxed" data-testid="text-profile-bio">{user.bio}</dd>
                      </div>
                    )}
                    {user.planName && (
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wider mb-1">Plan</dt>
                        <dd>
                          <Badge className="bg-black text-white" data-testid="status-profile-plan">{user.planName}</Badge>
                        </dd>
                      </div>
                    )}
                    {user.talentTags.length > 0 && (
                      <div>
                        <dt className="text-xs text-gray-400 uppercase tracking-wider mb-2">Talent Tags</dt>
                        <dd className="flex flex-wrap gap-1.5">
                          {user.talentTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs rounded-full" data-testid={`tag-profile-${tag}`}>
                              {tag}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-black text-xl">Media Gallery</h2>
                  <Button
                    className="bg-black hover:bg-gray-800 text-white rounded-xl gap-2"
                    data-testid="button-add-media"
                  >
                    <Plus size={15} />
                    Add Media
                  </Button>
                </div>

                {loadingMedia ? (
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : media && media.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {media.map((item) => (
                      <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group" data-testid={`media-item-${item.id}`}>
                        {item.mediaType === "image" ? (
                          <img src={item.url} alt={item.title ?? ""} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                            <span className="text-sm font-medium uppercase">{item.mediaType}</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-delete-media-${item.id}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <Image size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No media uploaded yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-black text-xl mb-6">Profile Analytics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Profile Views", value: "—" },
                    { label: "Search Appearances", value: "—" },
                    { label: "Contact Clicks", value: "—" },
                    { label: "Media Views", value: "—" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#F5F5F5] rounded-xl p-4 text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      <p className="text-2xl font-black text-black">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-400 text-sm mt-8">
                  Analytics tracking will be available soon
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
