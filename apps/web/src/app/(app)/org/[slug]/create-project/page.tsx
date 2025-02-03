import { redirect } from 'next/navigation'

import { ProjectTypes } from '@projects/index'
import { ability } from '@/auth/auth'

import { ProjectForm } from './project-form'

export default async function CreateProject() {
  const permissions = await ability()
  const types = '' as ProjectTypes
  console.log(types)
  if (permissions?.cannot('create', 'Project')) {
    redirect('/')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create project11</h1>
      <select name="type" id="type">
        { types }
        <option value="type">{ types }</option>
      </select>

      <ProjectForm />
    </div>
  )
}
