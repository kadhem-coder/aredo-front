// Helper functions for data validation and transformation

export const isValidArray = (data: any): data is any[] => {
  return Array.isArray(data) && data.length >= 0
}

export const safeArrayAccess = <T>(data: T[] | undefined | null, defaultValue: T[] = []): T[] => {
  return isValidArray(data) ? data : defaultValue
}

export const formatUserType = (userType: string): string => {
  const typeMap: Record<string, string> = {
    super_admin: "مدير عام",
    office_manager: "مدير مكتب", 
    group_supervisor: "مشرف مجموعة"
  }
  return typeMap[userType] || userType
}

export const getUserTypeColor = (userType: string): string => {
  const colorMap: Record<string, string> = {
    super_admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    office_manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    group_supervisor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  }
  return colorMap[userType] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    })
  } catch {
    return "تاريخ غير صحيح"
  }
}

export const formatDateTime = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric", 
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "تاريخ غير صحيح"
  }
}
