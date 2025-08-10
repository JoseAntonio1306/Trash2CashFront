import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, Truck, Shield, BarChart3, Users, Leaf } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Recycle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforma tus <span className="text-green-600">residuos</span>
              <br />
              en <span className="text-blue-600">oportunidades</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              T2C conecta generadores de residuos con recicladoras, facilitando la economía circular 
              con logística tercerizada, pagos seguros y trazabilidad completa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/publish"
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Publicar Lote</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/feed"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Explorar Lotes</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona T2C?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una plataforma integral que simplifica el proceso de reciclaje y genera valor para todos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Publica tus Residuos</h3>
              <p className="text-gray-600">
                Sube fotos, especifica tipo y cantidad. Nuestro sistema sugiere precios de mercado automáticamente.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Conecta y Negocia</h3>
              <p className="text-gray-600">
                Recibe ofertas de recicladoras verificadas. Negocia precios y condiciones de manera transparente.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Logística Integrada</h3>
              <p className="text-gray-600">
                Transportistas aliados se encargan del retiro. Seguimiento en tiempo real y pagos seguros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Beneficios para tu empresa
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pagos Seguros</h3>
                    <p className="text-gray-600">Sistema de escrow que protege tanto a compradores como vendedores.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes ESG</h3>
                    <p className="text-gray-600">Métricas de impacto ambiental y certificaciones para tus reportes de sostenibilidad.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Trazabilidad Completa</h3>
                    <p className="text-gray-600">Seguimiento desde la generación hasta el reciclaje final con certificados digitales.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Impacto hasta la fecha</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">15.4k</div>
                    <div className="text-gray-600">Kg Reciclados</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">3.1k</div>
                    <div className="text-gray-600">Kg CO₂ Evitado</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">47</div>
                    <div className="text-gray-600">Operaciones</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
                    <div className="text-gray-600">Empresas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para transformar tus residuos en valor?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Únete a la red de empresas que ya están generando ingresos con sus residuos
          </p>
          <Link
            to="/auth?mode=register"
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Comenzar Ahora</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};