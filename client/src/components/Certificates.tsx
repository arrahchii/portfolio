import { ExternalLink, Award } from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  image?: string;
}

const certificates: Certificate[] = [
  {
    id: "1",
    title: "Elements of AI",
    issuer: "University of Helsinki",
    issueDate: "September 2025",
    credentialUrl: "https://certificates.mooc.fi/validate/nywglqetasb",
    image: "/Certification.png"
  },
  {
    id: "2",
    title: "Foundations of AI and Machine Learning",
    issuer: "Coursera",
    issueDate: "September 2025",
    credentialUrl: "https://coursera.org/share/4c3faae91d146061dde1e38d88c440a4",
    image: "/Certification2.png"
  },
  {
    id: "3",
    title: "Professional Certificate",
    issuer: "Technology Institute",
    issueDate: "November 2024",
    credentialUrl: "https://example.com/verify/cert3",
    image: "/Certification3.jpeg"
  }
];

export default function Certificates() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden py-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-100/30 to-gray-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-100/30 to-gray-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-gray-50/20 via-gray-100/20 to-gray-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="w-full max-w-none px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-gray-400/20 via-gray-500/20 to-gray-600/20 rounded-full blur-3xl opacity-30"></div>
          </div>
          
          {/* Icon Decoration */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-black rounded-2xl mb-8 shadow-lg">
            <Award className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-700 to-black bg-clip-text text-transparent mb-6 leading-tight">
            Professional <span className="text-gray-800">Certifications</span>
          </h2>
          
          {/* Decorative Underline */}
          <div className="w-32 h-1 bg-gradient-to-r from-gray-600 to-black mx-auto mb-6 rounded-full"></div>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Showcasing my commitment to <span className="text-gray-800 font-semibold">continuous learning</span> and 
            <span className="text-gray-900 font-semibold"> professional development</span> in cutting-edge technologies
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 gap-12 w-full">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:border-gray-400"
            >
              {/* Certificate Image */}
              <div className="relative aspect-[16/9] min-h-[400px] overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial, sans-serif' font-size='18'%3ECertificate Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Certificate Content */}
              <div className="p-4 sm:p-6 lg:p-8 bg-white">
                <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent mb-4 group-hover:from-gray-800 group-hover:to-black transition-all duration-500">
                  {certificate.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <p className="text-xl text-slate-600">
                      <span className="font-semibold text-slate-800">Issued by:</span> {certificate.issuer}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                    <p className="text-lg text-slate-600">
                      <span className="font-semibold text-slate-800">Date:</span> {certificate.issueDate}
                    </p>
                  </div>
                </div>

                {certificate.credentialUrl && (
                  <div className="pt-4 border-t border-slate-200">
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-700 to-black text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group/btn"
                    >
                      <ExternalLink className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                      <span className="text-base">View Credential</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}