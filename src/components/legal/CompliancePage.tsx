import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileCheck, Award } from 'lucide-react';

export default function CompliancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold hover:opacity-80 transition-opacity duration-200"
          >
            <span className="text-white">Fintra</span>
            <span className="text-red-500">AI</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-12 h-12 text-red-500 mr-4" />
            <h1 className="text-5xl font-bold">Compliance <span className="text-red-500">Standards</span></h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We maintain the highest standards of compliance and regulatory adherence.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold text-red-400">Data Protection Compliance</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              We comply with major data protection regulations worldwide.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>GDPR</strong> - General Data Protection Regulation (EU)</li>
              <li><strong>CCPA</strong> - California Consumer Privacy Act (US)</li>
              <li><strong>PIPEDA</strong> - Personal Information Protection and Electronic Documents Act (Canada)</li>
              <li><strong>LGPD</strong> - Lei Geral de Proteção de Dados (Brazil)</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <FileCheck className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold text-red-400">Financial Services Compliance</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              As a platform serving financial professionals, we adhere to relevant financial regulations.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>SEC</strong> - Securities and Exchange Commission guidelines</li>
              <li><strong>FINRA</strong> - Financial Industry Regulatory Authority standards</li>
              <li><strong>SOX</strong> - Sarbanes-Oxley Act compliance for data integrity</li>
              <li><strong>PCI DSS</strong> - Payment Card Industry Data Security Standard</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">Security Certifications</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our security practices are validated by industry-recognized certifications.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>SOC 2 Type II</strong> - Service Organization Control 2 audit</li>
              <li><strong>ISO 27001</strong> - Information Security Management System</li>
              <li><strong>ISO 27017</strong> - Cloud Security Controls</li>
              <li><strong>ISO 27018</strong> - Cloud Privacy Protection</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">Audit & Transparency</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We maintain transparency through regular audits and assessments.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Annual third-party security audits</li>
              <li>Quarterly compliance assessments</li>
              <li>Regular penetration testing</li>
              <li>Continuous monitoring and reporting</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">Data Residency & Sovereignty</h2>
            <p className="text-gray-300 leading-relaxed">
              We respect data residency requirements and provide options for data localization based on your jurisdiction's requirements.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">Compliance Support</h2>
            <p className="text-gray-300 leading-relaxed">
              Our compliance team is available to assist with any regulatory questions or requirements. Contact us at compliance@fintraai.com for support with your specific compliance needs.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}