import { useState, useEffect } from "react";
import { Save, User, Building, Bell, Shield, UserPlus, Users, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CreateUserModal } from "@/components/modals/CreateUserModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Configuracoes() {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const { isAdmin, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [schoolSettings, setSchoolSettings] = useState({
    id: "",
    school_name: "Acompanhamento Escolar",
    address: "",
    city: "Palmas",
    state: "Tocantins",
    phone: "",
    email: "",
  });

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch school settings - try school_info first, then site_settings as fallback
        const { data: infoData, error: infoError } = await supabase
          .from("school_info")
          .select("*")
          .order('updated_at', { ascending: false })
          .limit(1);

        let settingsData = infoData?.[0] || null;
        let settingsError = infoError;

        // If school_info fails (e.g. table not found), try site_settings
        if (settingsError) {
          console.log("school_info failed, trying site_settings fallback:", settingsError.message);
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("site_settings")
            .select("*")
            .order('updated_at', { ascending: false })
            .limit(1);

          if (!fallbackError) {
            // If site_settings successful (even if empty), we clear the previous error
            settingsData = fallbackData?.[0] || null;
            settingsError = null;
          } else {
            // Both failed
            settingsError = fallbackError;
          }
        }

        // If both exist but are empty, or if we cleared error but found no row
        if (!settingsError && !settingsData) {
          console.log("No settings found in either table, using defaults.");
          setSchoolSettings({
            id: SETTINGS_ID,
            school_name: "Acompanhamento Escolar",
            address: "",
            city: "",
            state: "",
            phone: "",
            email: "",
          });
        } else if (settingsError) {
          console.error("Critical error fetching settings:", settingsError);
          toast.error("Erro ao carregar dados da escola. Verifique as tabelas no Supabase.");
        } else if (settingsData) {
          console.log("School settings loaded successfully:", settingsData);
          setSchoolSettings({
            id: settingsData.id,
            school_name: settingsData.school_name || "Acompanhamento Escolar",
            address: settingsData.address || "",
            city: settingsData.city || "",
            state: settingsData.state || "",
            phone: String(settingsData.phone || ""),
            email: settingsData.email || "",
          });
        }

        // Fetch user profile
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (!profileError && profileData) {
            setProfile({
              id: profileData.id,
              name: profileData.name,
              email: profileData.email || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const SETTINGS_ID = "00000000-0000-0000-0000-000000000000";

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update school settings if admin
      if (isAdmin) {
        // We try to upsert to school_info primarily
        const { error: settingsError } = await supabase
          .from("school_info")
          .upsert({
            id: schoolSettings.id || SETTINGS_ID,
            school_name: schoolSettings.school_name,
            address: schoolSettings.address,
            city: schoolSettings.city,
            state: schoolSettings.state,
            phone: schoolSettings.phone,
            email: schoolSettings.email,
          });

        if (settingsError) {
          console.error("Error saving to school_info, trying site_settings:", settingsError);

          // Sanitizamos o telefone (apenas números) para o caso de a tabela site_settings usar tipo numérico
          const numericPhone = schoolSettings.phone.replace(/\D/g, "");

          // Fallback save to site_settings if school_info fails
          const { error: fallbackError } = await supabase
            .from("site_settings")
            .upsert({
              id: schoolSettings.id || SETTINGS_ID,
              school_name: schoolSettings.school_name,
              address: schoolSettings.address,
              city: schoolSettings.city,
              state: schoolSettings.state,
              phone: numericPhone,
              email: schoolSettings.email,
            });

          if (fallbackError) throw fallbackError;
        }
      } else {
        toast.error("Você não tem permissão de administrador para salvar estas configurações.");
        setSaving(false);
        return;
      }

      // Update user profile
      if (profile.id) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            name: profile.name,
            email: profile.email,
          })
          .eq("id", profile.id);

        if (profileError) throw profileError;
      }

      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Configurações</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie as configurações do sistema
            </p>
          </div>
          <Button
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar Alterações
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* School Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Dados da Escola
              </CardTitle>
              <CardDescription>
                Informações básicas sobre a escola
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">Nome da Escola</Label>
                <Input
                  id="school-name"
                  value={schoolSettings.school_name}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, school_name: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Endereço completo"
                  value={schoolSettings.address || ""}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, address: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={schoolSettings.city || ""}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, city: e.target.value })}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={schoolSettings.state || ""}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, state: e.target.value })}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(63) 99999-9999"
                  value={schoolSettings.phone || ""}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, phone: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail da Escola</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@escola.com"
                  value={schoolSettings.email || ""}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, email: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>
            </CardContent>
          </Card>

          {/* User Profile */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Meu Perfil
              </CardTitle>
              <CardDescription>
                Suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Nome Completo</Label>
                <Input
                  id="user-name"
                  placeholder="Seu nome"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">E-mail</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground italic">
                Para alterar sua senha, utilize a opção de recuperação na tela de login.
              </p>
            </CardContent>
          </Card>

          {/* Notifications config UI (Visual Only as per original) */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure suas preferências de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por E-mail</p>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações por e-mail
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembrete de Aulas</p>
                  <p className="text-sm text-muted-foreground">
                    Notificação antes das aulas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* User Management - Admin Only */}
          {isAdmin && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Gerenciar Usuários
                </CardTitle>
                <CardDescription>
                  Criar e gerenciar usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Criar Novo Usuário</p>
                    <p className="text-sm text-muted-foreground">
                      Adicione administradores ou professores
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsCreateUserModalOpen(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Novo Usuário
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <CreateUserModal
        open={isCreateUserModalOpen}
        onOpenChange={setIsCreateUserModalOpen}
      />
    </MainLayout>
  );
}
