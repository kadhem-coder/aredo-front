// app/dashboard/forms/createOrUpdate/components/DynamicFormField.tsx

import React from 'react'
import { Loader2, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { formsHelpers, type DegreeType, type GovernorateCode } from '@/services/forms'
import { fieldIcons, fieldLabels, fieldPlaceholders, FIELD_CATEGORIES } from './FormConstants'

interface DynamicFormFieldProps {
  fieldName: string
  value: any
  onChange: (value: any) => void
  error?: string
  isLoading?: boolean
  universitiesData?: any
  isLoadingUniversities?: boolean
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  fieldName,
  value,
  onChange,
  error,
  isLoading,
  universitiesData,
  isLoadingUniversities
}) => {
  const Icon = fieldIcons[fieldName] || FileText

  // University Select
  if (fieldName === 'university') {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldName} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {fieldLabels[fieldName]}
        </Label>
        <Select value={value} onValueChange={onChange} disabled={isLoading || isLoadingUniversities}>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder="اختر الجامعة" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingUniversities ? (
              <div className="p-2 text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              </div>
            ) : universitiesData?.data?.results?.length > 0 ? (
              universitiesData.data.results.map((university: any) => (
                <SelectItem key={university.id} value={university.id}>
                  {university.name}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-center text-sm text-muted-foreground">
                لا توجد جامعات متاحة
              </div>
            )}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  // Degree Select
  if (fieldName === 'degree') {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldName} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {fieldLabels[fieldName]}
        </Label>
        <Select value={value} onValueChange={(val) => onChange(val as DegreeType)} disabled={isLoading}>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder="اختر الدرجة العلمية" />
          </SelectTrigger>
          <SelectContent>
            {formsHelpers.getDegreeOptions().map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  // Governorate Select
  if (fieldName === 'govern' || fieldName === 'by') {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldName} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {fieldLabels[fieldName]}
        </Label>
        <Select value={value} onValueChange={(val) => onChange(val as GovernorateCode)} disabled={isLoading}>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder="اختر المحافظة" />
          </SelectTrigger>
          <SelectContent>
            {formsHelpers.getGovernorateOptions().map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  // Boolean Checkbox
  if (FIELD_CATEGORIES.boolean.includes(fieldName) || FIELD_CATEGORIES.status.includes(fieldName)) {
    return (
      <div className="flex items-center space-x-2 space-x-reverse">
        <Checkbox id={fieldName} checked={value || false} onCheckedChange={onChange} disabled={isLoading} />
        <Label htmlFor={fieldName} className="cursor-pointer flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {fieldLabels[fieldName]}
        </Label>
        {error && <p className="text-sm text-destructive ml-6">{error}</p>}
      </div>
    )
  }

  // Textarea for Notes
  if (fieldName === 'notes') {
    return (
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={fieldName} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {fieldLabels[fieldName]}
        </Label>
        <Textarea
          id={fieldName}
          placeholder={fieldPlaceholders[fieldName]}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          rows={4}
          maxLength={500}
          className={error ? 'border-destructive' : ''}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  // Email Input
  if (fieldName === 'email') {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldName} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {fieldLabels[fieldName]} *
        </Label>
        <Input
          id={fieldName}
          type="email"
          placeholder={fieldPlaceholders[fieldName]}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className={error ? 'border-destructive' : ''}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  // Phone Input
  if (fieldName === 'phone') {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldName} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {fieldLabels[fieldName]} *
        </Label>
        <Input
          id={fieldName}
          type="tel"
          placeholder={fieldPlaceholders[fieldName]}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          maxLength={11}
          className={error ? 'border-destructive' : ''}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  // Default Text Input
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName} className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {fieldLabels[fieldName]} {fieldName === 'full_name' && '*'}
      </Label>
      <Input
        id={fieldName}
        placeholder={fieldPlaceholders[fieldName] || `أدخل ${fieldLabels[fieldName]}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}