import React from 'react';
import { MapPin, Globe, ExternalLink, Link } from 'lucide-react';

export default function ONGProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
          {profile.logo ? (
            <img src={profile.logo} alt={`Logo ${profile.name}`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 font-bold text-xl">{profile.name.charAt(0)}</span>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0A3D36] tracking-tight">{profile.name}</h2>
            <p className="text-[#0A665C] font-semibold text-sm uppercase tracking-widest">{profile.cause}</p>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl font-medium">
            {profile.description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center space-x-1.5 text-gray-500 text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{profile.city}, {profile.state}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-500 text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-full">
              <span className="text-gray-400">Atuação:</span>
              <span>{profile.yearsOperating} anos</span>
            </div>
            {profile.website && (
              <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 text-teal-600 hover:text-teal-800 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-full transition">
                <Globe className="w-3.5 h-3.5" />
                <span>Website</span>
              </a>
            )}
            {profile.socialLinks?.instagram && (
              <a href="#" className="flex items-center space-x-1.5 text-pink-600 hover:text-pink-800 text-xs font-bold bg-pink-50 px-3 py-1.5 rounded-full transition">
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            )}
            {profile.socialLinks?.facebook && (
              <a href="#" className="flex items-center space-x-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-full transition">
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
