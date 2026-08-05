export type AccessLevel = "Full" | "Restricted" | "Limited" | "None";

export interface PermissionMatrix {
  [role: string]: {
    [domain: string]: AccessLevel;
  };
}

export class KnowledgeAccessPolicy {
  private matrix: PermissionMatrix = {
    "CEO": {
      "financial": "Full",
      "strategic": "Full",
      "people": "Full"
    },
    "Advisor": {
      "financial": "Restricted",
      "strategic": "Full",
      "people": "Restricted"
    },
    "Analyst": {
      "financial": "Limited",
      "strategic": "Limited",
      "operational": "Full"
    }
  };

  canAccessDomain(role: string, domain: string): AccessLevel {
    const rolePermissions = this.matrix[role];
    if (!rolePermissions) return "None";
    
    return rolePermissions[domain] || "None";
  }

  evaluateAccess(role: string, artifactDomain: string, artifactConfidentiality: string): boolean {
    const level = this.canAccessDomain(role, artifactDomain);
    
    if (level === "None") return false;
    if (level === "Full") return true;

    if (level === "Restricted") {
      return artifactConfidentiality !== "restricted";
    }

    if (level === "Limited") {
      return artifactConfidentiality === "public" || artifactConfidentiality === "internal";
    }

    return false;
  }
}
