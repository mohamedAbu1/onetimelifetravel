"use client";

export default function AdminModuleHeader({ eyebrow, title, description, icon: Icon, actions }) {
  return (
    <div className="admin-module-header">
      <div className="admin-module-heading">
        {Icon && <span className="admin-module-icon"><Icon /></span>}
        <div>
          {eyebrow && <span className="admin-eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      {actions && <div className="admin-module-actions">{actions}</div>}
    </div>
  );
}
