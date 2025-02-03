'use client'

import Table from "@projects/cardapio/components/AdminPanelTable/Table"
import { CardapioSection } from "@projects/cardapio/@types"
import { useState, useEffect } from "react"

interface ProjectPageProps {
  params: {
    project: string
    template: string
  }
}

export default async function Projects({ params }: ProjectPageProps) {
  
  const { project, template } = params


  export default function Panel() {

    const [data, setData] = useState<CardapioSection[]>([])
    const [order, setOrder] = useState<any>([])

    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch('/api/cardapio/items', {
          headers: {
            'x-internal-key': `${process.env.INTERNAL_KEY}`
          }
        })
        const res = await response.json()
        setData(res)
        setOrder(Object.keys(res[0].items[0]))
      }
      fetchData()

    }, [])


    function getItemData() {
      const obj = {} as any
      obj.name = prompt('Nome do item:')
      obj.discount = prompt('Desconto:')
      obj.description = prompt('Descrição:')
      obj.currentPrice = prompt('Preço atual:')
      obj.originalPrice = prompt('Preço Original')
      return obj
    }

    async function handleAddItem(sectName: string) {

      const objData = {
        sectionName: sectName,
        data: getItemData()
      }
      const res = await fetch('/api/cardapio/items/create', {
        method: 'POST',
        body: JSON.stringify(objData)
      })

      if (res.ok) {
        window.location.reload()
      }
    }

    function getSectionData() {
      return prompt('Nome da sessão:')
    }

    async function handleAddSection() {
      const res = await fetch('/api/cardapio/section/create', {
        method: 'POST',
        body: JSON.stringify({ sectionName: getSectionData() })
      })

      if (res.ok) {
        window.location.reload()
      }
    }


    function continueToDelete() {
      return confirm('Você deseja apagar está sessão?')
    }

    async function handleDeleteSection(name: string) {

      if (!continueToDelete()) return

      const res = await fetch(`/api/cardapio/section/delete?n=${name}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        window.location.reload()
      }

    }

    return (
      <div className="flex-1 p-6 text-black">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Manage Items
          </h1>
          <button onClick={handleAddSection} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <i className="fas fa-plus mr-2">
            </i>
            New Section
          </button>
        </div>
        <main className="flex flex-1 p-6 flex-col-reverse">

          {
            data.map(({ sectionName, items }, index) => {


              return (
                <Table.section className="flex-1 p-6 flex-col-reverse" sectionName={sectionName} key={sectionName}>
                  <div className="flex justify-between flex-row-reverse w-full items-end mb-6">
                    <button onClick={() => handleDeleteSection(sectionName)} className="transition-colors  ease-in-out text-white px-4 py-2 rounded bg-red-400 hover:bg-red-600 ">
                      <i className="fas fa-minus mr-2">
                      </i>
                      Delete Section
                    </button>
                    <button onClick={() => handleAddItem(sectionName)} className="transition-colors ease-in-out bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600">
                      <i className="fas fa-plus mr-2">
                      </i>
                      Add New Item
                    </button>
                  </div>
                  <Table.root className="w-full">
                    <Table.head className="rounded-t-lg w-full" headerTitles={order} />
                    <Table.body className="w-full">
                      {
                        items.map((item, i) => {
                          const keys = Object.keys(item)
                          const values: any = []
                          keys.forEach((key) => {
                            // @ts-expect-error
                            values.push(item[key])
                          })

                          return <Table.row sectionName={sectionName} rowContent={values} key={item.name} />
                        })
                      }
                    </Table.body>
                  </Table.root>
                </Table.section>)
            })
          }

        </main>
      </div>

    )
  }