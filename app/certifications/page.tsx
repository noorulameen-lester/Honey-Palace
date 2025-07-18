import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Award, Shield, Leaf, CheckCircle } from "lucide-react"

export default function CertificationsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Certifications & Quality Standards
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            At Honey Palace, quality is our top priority. We maintain the highest standards through rigorous testing and
            internationally recognized certifications.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "USDA Organic Certified",
              icon: Leaf,
              badge: "Organic",
              description:
                "Our organic honey varieties are certified by the USDA, ensuring they meet strict organic standards.",
              details: ["No synthetic pesticides", "No artificial additives", "Sustainable farming practices"],
            },
            {
              title: "FDA Approved Facility",
              icon: Shield,
              badge: "FDA",
              description: "Our processing facility is FDA registered and follows all federal food safety guidelines.",
              details: ["Regular inspections", "HACCP compliance", "Food safety protocols"],
            },
            {
              title: "ISO 22000 Certified",
              icon: Award,
              badge: "ISO",
              description: "International food safety management system certification ensuring consistent quality.",
              details: ["Quality management", "Risk assessment", "Continuous improvement"],
            },
            {
              title: "Non-GMO Verified",
              icon: CheckCircle,
              badge: "Non-GMO",
              description: "All our honey products are verified to be free from genetically modified organisms.",
              details: ["Third-party testing", "Supply chain verification", "Transparent sourcing"],
            },
            {
              title: "Kosher Certified",
              icon: Award,
              badge: "Kosher",
              description: "Our honey meets kosher dietary requirements and is certified by recognized authorities.",
              details: ["Rabbinical supervision", "Kosher ingredients only", "Proper handling procedures"],
            },
            {
              title: "Fair Trade Certified",
              icon: CheckCircle,
              badge: "Fair Trade",
              description: "Supporting fair wages and sustainable practices for our partner beekeepers.",
              details: ["Fair compensation", "Community development", "Environmental protection"],
            },
          ].map((cert, index) => {
            const Icon = cert.icon
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 text-white rounded-full mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">{cert.title}</CardTitle>
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    {cert.badge}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{cert.description}</p>
                  <ul className="space-y-2">
                    {cert.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quality Process */}
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Our Quality Assurance Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Source Selection",
                description: "Carefully vetted beekeepers using sustainable practices",
              },
              {
                step: "2",
                title: "Raw Material Testing",
                description: "Every batch tested for purity, moisture, and quality markers",
              },
              {
                step: "3",
                title: "Processing Control",
                description: "Minimal processing to preserve natural enzymes and nutrients",
              },
              {
                step: "4",
                title: "Final Inspection",
                description: "Comprehensive quality check before packaging and shipping",
              },
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{process.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{process.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testing Standards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Testing Standards & Parameters
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Purity Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">Moisture content analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">Sugar composition verification</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">Adulterant detection</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">Heavy metals screening</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Microbiological Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">Bacterial contamination check</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">Yeast and mold analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">Pathogen screening</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">Shelf-life validation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Certificate Gallery */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Certificates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "USDA Organic Certificate", image: "/placeholder.svg?height=300&width=400" },
              { name: "FDA Registration", image: "/placeholder.svg?height=300&width=400" },
              { name: "ISO 22000 Certificate", image: "/placeholder.svg?height=300&width=400" },
            ].map((cert, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-4">
                  <Image
                    src={cert.image || "/placeholder.svg"}
                    alt={cert.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
