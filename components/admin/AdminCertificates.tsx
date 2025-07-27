"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

type Certificate = {
  _id?: string
  name: string
  description: string
  image: string
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newCertificate, setNewCertificate] = useState<Certificate>({
    name: "",
    description: "",
    image: "",
  })
  const [editCertificate, setEditCertificate] = useState<Certificate | null>(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/certificates")
      const data = await res.json()
      if (data.success) {
        setCertificates(data.certificates)
      } else {
        setError(data.error || "Failed to fetch certificates")
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch certificates")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCertificate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCertificate),
      })
      const data = await res.json()
      if (data.success) {
        setIsDialogOpen(false)
        setNewCertificate({ name: "", description: "", image: "" })
        fetchCertificates()
      } else {
        setError(data.error || "Failed to add certificate")
      }
    } catch (err: any) {
      setError(err.message || "Failed to add certificate")
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (cert: Certificate) => {
    setEditCertificate(cert)
    setEditDialogOpen(true)
  }

  const handleEditCertificate = async () => {
    if (!editCertificate || !editCertificate._id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/certificates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCertificate),
      })
      const data = await res.json()
      if (data.success) {
        setEditDialogOpen(false)
        setEditCertificate(null)
        fetchCertificates()
      } else {
        setError(data.error || "Failed to update certificate")
      }
    } catch (err: any) {
      setError(err.message || "Failed to update certificate")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Section heading for clarity */}
      <div className="border-b pb-4 mb-4">
        <h1 className="text-3xl font-extrabold text-yellow-900">Certificates</h1>
        <p className="text-gray-600 text-base mt-1">
          Manage certificates displayed on the Certification page. (Find this section under Analytics in the sidebar.)
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Certificates</h2>
          <p className="text-gray-500 text-sm mt-1">
            Add, edit, or update certificates displayed on the Certification page.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Certificate</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Certificate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Name</Label>
              <Input
                value={newCertificate.name}
                onChange={e => setNewCertificate({ ...newCertificate, name: e.target.value })}
                placeholder="Certificate Name"
              />
              <Label>Description</Label>
              <Textarea
                value={newCertificate.description}
                onChange={e => setNewCertificate({ ...newCertificate, description: e.target.value })}
                placeholder="Certificate Description"
              />
              <Label>Image URL</Label>
              <Input
                value={newCertificate.image}
                onChange={e => setNewCertificate({ ...newCertificate, image: e.target.value })}
                placeholder="Image URL"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddCertificate}>Add</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {loading && <div className="text-center py-8 text-lg text-yellow-600">Loading certificates...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && certificates.length === 0 && (
        <div className="text-center py-8 text-gray-400">No certificates found.</div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map(cert => (
          <Card key={cert._id || cert.name} className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>{cert.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={cert.image || "/placeholder.svg"}
                alt={cert.name}
                width={400}
                height={200}
                className="rounded mb-4"
              />
              <p className="mb-2">{cert.description}</p>
              <Button variant="outline" onClick={() => openEditDialog(cert)}>
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Certificate</DialogTitle>
          </DialogHeader>
          {editCertificate && (
            <div className="space-y-4">
              <Label>Name</Label>
              <Input
                value={editCertificate.name}
                onChange={e => setEditCertificate({ ...editCertificate, name: e.target.value })}
              />
              <Label>Description</Label>
              <Textarea
                value={editCertificate.description}
                onChange={e => setEditCertificate({ ...editCertificate, description: e.target.value })}
              />
              <Label>Image URL</Label>
              <Input
                value={editCertificate.image}
                onChange={e => setEditCertificate({ ...editCertificate, image: e.target.value })}
              />
              <div className="flex justify-end">
                <Button onClick={handleEditCertificate}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
