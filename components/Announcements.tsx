import Image from "next/image";
import React from "react";

const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400"> View All</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaSkyLight p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-gray-400 text-xs bg-white px-2 py-1 rounded-md">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia
            libero ipsam ducimus molestiae aliquam minus perferendis!
          </p>
        </div>
        <div className="bg-lamaPurpleLight p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-gray-400 text-xs bg-white px-2 py-1 rounded-md">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia
            libero ipsam ducimus molestiae aliquam minus perferendis!
          </p>
        </div>
        <div className="bg-lamaYellowLight p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-gray-400 text-xs bg-white px-2 py-1 rounded-md">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia
            libero ipsam ducimus molestiae aliquam minus perferendis!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
