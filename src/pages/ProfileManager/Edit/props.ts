export interface ModuleInfo {
  moduleId: number;
  moduleName: string;
  permissionScore: number;
}
export interface EditProfileProps {
  profileID?: number;
  profileName: string;
  moduleInfo?: ModuleInfo[];
  id?: number;
  name?: string;
  status?: string;
}
