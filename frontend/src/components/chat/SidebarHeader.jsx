import React from "react";
import { LuPanelRightOpen } from "react-icons/lu";
import { GoSidebarCollapse } from "react-icons/go";

import { GeoScoutLogo, BRAND } from "../../config/brand";

export default function SidebarHeader({ 
  sidebarCollapsed, 
  isHoveringLogo,
  toggleSidebar,
  theme,
  textColor,
  hoverChatBg,
  handleImageError
}) {
  return (
    <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between min-w-0 relative">
        {!sidebarCollapsed ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <GeoScoutLogo className="h-7 w-7 flex-shrink-0" />
              <span className={`${textColor} text-lg font-extrabold tracking-tight truncate`}>{BRAND.name}</span>
            </div>
            <button
              onClick={toggleSidebar}
              title="Collapse Sidebar"
              className={`p-2 rounded-lg ${hoverChatBg} transition-colors cursor-pointer flex-shrink-0`}
            >
              <LuPanelRightOpen className={`${textColor} text-xl`} style={{ strokeWidth: 1.5 }} />
            </button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <div className="relative h-10 w-10 flex items-center justify-center flex-shrink-0">
              <div 
                className={`absolute transition-opacity duration-200 ${
                  isHoveringLogo ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <GeoScoutLogo className="h-7 w-7" />
              </div>
              <GoSidebarCollapse 
                className={`absolute ${textColor} text-2xl transition-opacity duration-200 cursor-pointer ${
                  isHoveringLogo ? 'opacity-100' : 'opacity-0'
                }`} 
                style={{ strokeWidth: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSidebar();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
