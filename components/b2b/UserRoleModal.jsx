"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, UserPlus, ShieldCheck, Trash2, Save, Mail, Phone } from "lucide-react";

export default function UserRoleModal({ isOpen, onClose, onSave, company }) {
  const [contacts, setContacts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("Purchasing Manager");

  useEffect(() => {
    if (company && company.contacts) {
      setContacts([...company.contacts]);
    } else {
      setContacts([]);
    }
  }, [company, isOpen]);

  if (!isOpen || !company) return null;

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newContact = {
      id: `cnt-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone || "+1 555 0100",
      role: newRole,
    };

    setContacts([...contacts, newContact]);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
  };

  const handleRemoveContact = (cntId) => {
    setContacts(contacts.filter((c) => c.id !== cntId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ companyId: company.id, contacts });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-role-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#151515] border border-[#2A2A2A] rounded-[24px] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-[#F8F6F3]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#090909] border border-[#2A2A2A] flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 id="user-role-modal-title" className="font-editorial text-2xl font-normal">
                  Multi-User Account Roles ({company.name})
                </h2>
                <p className="text-xs text-[#8E8A85]">
                  Manage authorized buyers, purchasing managers, and finance sign-offs.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-[#090909] border border-[#2A2A2A] hover:border-[#C8A45D] rounded-full text-[#8E8A85] hover:text-[#F8F6F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Contacts List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A45D]">
              Authorized Users ({contacts.length})
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {contacts.map((cnt) => (
                <div
                  key={cnt.id}
                  className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[12px] flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-sm text-[#F8F6F3] block">
                      {cnt.name}
                    </span>
                    <span className="text-[11px] text-[#8E8A85]">
                      {cnt.email} • {cnt.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#151515] text-[#C8A45D] border border-[#2A2A2A] rounded">
                      {cnt.role}
                    </span>
                    {contacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveContact(cnt.id)}
                        className="p-1 text-[#8E8A85] hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Contact Form */}
          <form onSubmit={handleAddContact} className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[16px] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8F6F3] flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#C8A45D]" /> Add Authorized Contact
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-[#151515] border border-[#2A2A2A] rounded-[8px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-[#151515] border border-[#2A2A2A] rounded-[8px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="tel"
                placeholder="Phone Number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="bg-[#151515] border border-[#2A2A2A] rounded-[8px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
              />

              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="bg-[#151515] border border-[#2A2A2A] rounded-[8px] px-3 py-2 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none cursor-pointer"
              >
                <option value="Company Owner">Company Owner</option>
                <option value="Purchasing Manager">Purchasing Manager</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Employee">Employee</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#151515] hover:bg-[#C8A45D] hover:text-[#090909] text-[#F8F6F3] border border-[#2A2A2A] rounded-[8px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              + Append User to Account
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#090909] hover:bg-[#2A2A2A] text-[#8E8A85] hover:text-[#F8F6F3] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] rounded-[10px] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg font-bold"
            >
              <Save className="w-4 h-4" /> Save Contact Roles
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
