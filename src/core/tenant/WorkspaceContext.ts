export interface WorkspaceContext {
  workspaceId: string;
  tenantId: string;
  workspaceType: "executive_board" | "department" | "project_room";
  name: string;
}
