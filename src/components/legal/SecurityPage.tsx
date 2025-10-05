import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Shield, Key, Eye } from 'lucide-react';

export default function SecurityPage() {
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
            <Lock className="w-12 h-12 text-red-500 mr-4" />
            <h1 className="text-5xl font-bold">Security <span className="text-red-500">Overview</span></h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your data security is our top priority. Learn about our comprehensive security measures.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold text-red-400">Data Encryption</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              All data is encrypted both in transit and at rest using industry-standard encryption protocols.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>TLS 1.3 encryption for all data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>End-to-end encryption for sensitive research data</li>
              <li>Regular security audits and penetration testing</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <Key className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold text-red-400">Authentication & Access Control</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Multi-layered authentication ensures only authorized users can access your data.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Multi-factor authentication (MFA) support</li>
              <li>OAuth 2.0 integration with Google</li>
              <li>Role-based access control (RBAC)</li>
              <li>Session management and automatic logout</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <Eye className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold text-red-400">Monitoring & Compliance</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Continuous monitoring and compliance with industry standards.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>24/7 security monitoring and alerting</li>
              <li>SOC 2 Type II compliance</li>
              <li>GDPR and CCPA compliance</li>
              <li>Regular security assessments</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">Infrastructure Security</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our infrastructure is built on secure, enterprise-grade cloud platforms.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Hosted on secure cloud infrastructure</li>
              <li>Regular automated backups</li>
              <li>Disaster recovery procedures</li>
              <li>Network isolation and firewalls</li>
            </ul>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">Incident Response</h2>
            <p className="text-gray-300 leading-relaxed">
              We have a comprehensive incident response plan to quickly address any security concerns and notify affected users within 72 hours of discovery.
            </p>
          </section>

          <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">Report Security Issues</h2>
            <p className="text-gray-300 leading-relaxed">
              If you discover a security vulnerability, please report it to our security team at security@fintraai.com. We take all reports seriously and will respond promptly.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}