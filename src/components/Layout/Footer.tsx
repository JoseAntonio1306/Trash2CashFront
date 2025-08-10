import React from 'react';
import { Recycle, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">T2C - Trash to Cash</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Conectamos generadores de residuos con recicladoras, facilitando la economía circular 
              con logística tercerizada y trazabilidad completa.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="w-4 h-4" />
                <span>contacto@t2c.bo</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+591 2 123-4567</span>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/feed" className="hover:text-white transition-colors">Explorar Lotes</a></li>
              <li><a href="/publish" className="hover:text-white transition-colors">Publicar Residuos</a></li>
              <li><a href="/esg" className="hover:text-white transition-colors">Impacto ESG</a></li>
              <li><a href="/auth" className="hover:text-white transition-colors">Únete a T2C</a></li>
            </ul>
          </div>

          {/* Información legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Términos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Certificaciones</a></li>
            </ul>
            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>La Paz, Bolivia</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 T2C - Trash to Cash. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};