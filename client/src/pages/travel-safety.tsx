import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Plane, Shield, Smartphone, Wifi, CreditCard, MapPin, AlertTriangle,
  CheckCircle, Download, Globe, Phone, Building2, Lock, Eye, Bell,
  Key, Cloud, Battery, ChevronDown, ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const preFlightChecklist = [
  {
    category: "Account Security",
    icon: Lock,
    color: "text-blue-400",
    items: [
      { task: "Enable two-factor authentication on all important accounts", priority: "critical" },
      { task: "Update passwords for email, banking, and social media", priority: "recommended" },
      { task: "Set up login alerts for your bank accounts", priority: "critical" },
      { task: "Notify your bank and credit card companies of travel dates", priority: "critical" },
      { task: "Review and remove unused apps with account access", priority: "recommended" }
    ]
  },
  {
    category: "Device Preparation",
    icon: Smartphone,
    color: "text-green-400",
    items: [
      { task: "Install a reputable VPN app before departure", priority: "critical" },
      { task: "Update your phone and apps to latest versions", priority: "critical" },
      { task: "Enable device tracking (Find My iPhone/Android)", priority: "critical" },
      { task: "Set up a strong PIN or biometric lock", priority: "critical" },
      { task: "Back up your phone to cloud storage", priority: "recommended" },
      { task: "Download offline maps for your destination", priority: "recommended" }
    ]
  },
  {
    category: "Emergency Preparation",
    icon: Phone,
    color: "text-amber-400",
    items: [
      { task: "Save emergency contacts offline (not just in cloud)", priority: "critical" },
      { task: "Screenshot your passport and travel documents", priority: "critical" },
      { task: "Note your embassy's local phone number", priority: "critical" },
      { task: "Share your itinerary with a trusted family member", priority: "recommended" },
      { task: "Set up international roaming or buy local SIM info", priority: "recommended" }
    ]
  },
  {
    category: "Financial Safety",
    icon: CreditCard,
    color: "text-purple-400",
    items: [
      { task: "Set daily transaction limits on cards", priority: "recommended" },
      { task: "Enable instant transaction notifications", priority: "critical" },
      { task: "Bring a backup card from a different bank", priority: "recommended" },
      { task: "Know your card's international fraud hotline", priority: "recommended" },
      { task: "Avoid posting travel plans publicly on social media", priority: "recommended" }
    ]
  }
];

const touristScams = [
  {
    name: "Fake WiFi Networks",
    icon: Wifi,
    description: "Criminals set up WiFi hotspots with names like 'Airport_Free_WiFi' or 'Hotel_Guest' to intercept your data.",
    locations: "Airports, hotels, cafes, tourist areas",
    prevention: [
      "Always verify the official WiFi name with staff",
      "Use a VPN for all connections",
      "Avoid accessing banking on public WiFi",
      "Turn off auto-connect to open networks"
    ]
  },
  {
    name: "ATM Skimmers",
    icon: CreditCard,
    description: "Hidden devices attached to ATMs capture your card data and PIN. Particularly common at tourist-heavy locations.",
    locations: "Standalone ATMs, tourist districts, train stations",
    prevention: [
      "Use ATMs inside banks when possible",
      "Wiggle the card slot before inserting",
      "Cover your PIN with your hand",
      "Check for hidden cameras above the keypad"
    ]
  },
  {
    name: "Fake Taxi/Rideshare Apps",
    icon: MapPin,
    description: "Fraudulent apps that look like Uber or local taxi services, designed to steal payment info or overcharge tourists.",
    locations: "Airports, train stations, hotel pickups",
    prevention: [
      "Download official apps before traveling",
      "Verify the driver's photo and license plate",
      "Never pay cash if app shows card payment",
      "Share your ride details with someone"
    ]
  },
  {
    name: "Currency Exchange Fraud",
    icon: Building2,
    description: "Unofficial exchangers offer great rates but shortchange you, use rigged calculators, or pass counterfeit bills.",
    locations: "Street corners, small shops, tourist areas",
    prevention: [
      "Use bank ATMs for best exchange rates",
      "Count money before leaving the counter",
      "Know the current exchange rate beforehand",
      "Avoid exchangers who approach you on the street"
    ]
  },
  {
    name: "QR Code Scams",
    icon: Eye,
    description: "Fake QR codes placed over legitimate ones redirect you to phishing sites or malware downloads.",
    locations: "Restaurants, parking meters, tourist info boards",
    prevention: [
      "Check if QR code looks tampered or pasted over",
      "Verify the URL before entering any data",
      "Don't scan random QR codes from flyers",
      "Use your camera app, not third-party scanners"
    ]
  },
  {
    name: "Charging Station Attacks",
    icon: Battery,
    description: "'Juice jacking' uses public USB ports to install malware or steal data while your phone charges.",
    locations: "Airports, malls, cafes, hotel lobbies",
    prevention: [
      "Carry your own portable power bank",
      "Use a power-only USB cable (no data)",
      "Use wall outlets with your own adapter",
      "Decline 'Trust this device' prompts"
    ]
  }
];

const embassyContacts: Record<string, { country: string; embassy: string; phone: string; emergency: string }[]> = {
  "Europe": [
    { country: "United Kingdom", embassy: "US Embassy London", phone: "+44 20 7499 9000", emergency: "+44 20 7499 9000" },
    { country: "France", embassy: "US Embassy Paris", phone: "+33 1 43 12 22 22", emergency: "+33 1 43 12 22 22" },
    { country: "Germany", embassy: "US Embassy Berlin", phone: "+49 30 8305 0", emergency: "+49 30 8305 0" },
    { country: "Italy", embassy: "US Embassy Rome", phone: "+39 06 46741", emergency: "+39 06 46741" },
    { country: "Spain", embassy: "US Embassy Madrid", phone: "+34 91 587 2200", emergency: "+34 91 587 2200" },
    { country: "Netherlands", embassy: "US Embassy The Hague", phone: "+31 70 310 2209", emergency: "+31 70 310 2209" },
    { country: "Portugal", embassy: "US Embassy Lisbon", phone: "+351 21 727 3300", emergency: "+351 21 727 3300" },
    { country: "Greece", embassy: "US Embassy Athens", phone: "+30 210 721 2951", emergency: "+30 210 721 2951" },
    { country: "Switzerland", embassy: "US Embassy Bern", phone: "+41 31 357 70 11", emergency: "+41 31 357 70 11" }
  ],
  "Asia": [
    { country: "Japan", embassy: "US Embassy Tokyo", phone: "+81 3 3224 5000", emergency: "+81 3 3224 5000" },
    { country: "China", embassy: "US Embassy Beijing", phone: "+86 10 8531 4000", emergency: "+86 10 8531 4000" },
    { country: "Thailand", embassy: "US Embassy Bangkok", phone: "+66 2 205 4000", emergency: "+66 2 205 4000" },
    { country: "Vietnam", embassy: "US Embassy Hanoi", phone: "+84 24 3850 5000", emergency: "+84 24 3850 5000" },
    { country: "South Korea", embassy: "US Embassy Seoul", phone: "+82 2 397 4114", emergency: "+82 2 397 4114" },
    { country: "India", embassy: "US Embassy New Delhi", phone: "+91 11 2419 8000", emergency: "+91 11 2419 8000" },
    { country: "Philippines", embassy: "US Embassy Manila", phone: "+63 2 5301 2000", emergency: "+63 2 5301 2000" },
    { country: "Singapore", embassy: "US Embassy Singapore", phone: "+65 6476 9100", emergency: "+65 6476 9100" }
  ],
  "Americas": [
    { country: "Mexico", embassy: "US Embassy Mexico City", phone: "+52 55 5080 2000", emergency: "+52 55 5080 2000" },
    { country: "Canada", embassy: "US Embassy Ottawa", phone: "+1 613 238 5335", emergency: "+1 613 238 5335" },
    { country: "Brazil", embassy: "US Embassy Brasilia", phone: "+55 61 3312 7000", emergency: "+55 61 3312 7000" },
    { country: "Argentina", embassy: "US Embassy Buenos Aires", phone: "+54 11 5777 4533", emergency: "+54 11 5777 4533" },
    { country: "Colombia", embassy: "US Embassy Bogota", phone: "+57 1 275 2000", emergency: "+57 1 275 2000" },
    { country: "Peru", embassy: "US Embassy Lima", phone: "+51 1 618 2000", emergency: "+51 1 618 2000" },
    { country: "Costa Rica", embassy: "US Embassy San Jose", phone: "+506 2519 2000", emergency: "+506 2519 2000" }
  ],
  "Africa": [
    { country: "South Africa", embassy: "US Embassy Pretoria", phone: "+27 12 431 4000", emergency: "+27 12 431 4000" },
    { country: "Kenya", embassy: "US Embassy Nairobi", phone: "+254 20 363 6000", emergency: "+254 20 363 6000" },
    { country: "Nigeria", embassy: "US Embassy Abuja", phone: "+234 9 461 4000", emergency: "+234 9 461 4000" },
    { country: "Egypt", embassy: "US Embassy Cairo", phone: "+20 2 2797 3300", emergency: "+20 2 2797 3300" },
    { country: "Morocco", embassy: "US Embassy Rabat", phone: "+212 537 637 200", emergency: "+212 537 637 200" },
    { country: "Ghana", embassy: "US Embassy Accra", phone: "+233 30 274 1000", emergency: "+233 30 274 1000" },
    { country: "Tanzania", embassy: "US Embassy Dar es Salaam", phone: "+255 22 229 4000", emergency: "+255 22 229 4000" }
  ],
  "Oceania": [
    { country: "Australia", embassy: "US Embassy Canberra", phone: "+61 2 6214 5600", emergency: "+61 2 6214 5600" },
    { country: "New Zealand", embassy: "US Embassy Wellington", phone: "+64 4 462 6000", emergency: "+64 4 462 6000" },
    { country: "Fiji", embassy: "US Embassy Suva", phone: "+679 331 4466", emergency: "+679 331 4466" }
  ]
};

export default function TravelSafety() {
  useSEO({
    title: "Travel Safety Checklist - GetCyberRight",
    description: "Prepare for safe travels with our pre-trip cybersecurity checklist. Protect your devices, accounts, and personal data while traveling abroad.",
    keywords: "travel safety, cybersecurity travel, tourist scams, travel checklist, embassy contacts, ATM skimmer, fake wifi, travel security"
  });

  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const totalItems = preFlightChecklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedCount = completedItems.size;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const countriesForRegion = selectedRegion ? embassyContacts[selectedRegion] || [] : [];
  const selectedEmbassy = countriesForRegion.find(c => c.country === selectedCountry);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Plane className="h-4 w-4" />
            Pre-Travel Security Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Travel Safety Checklist
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Protect yourself and your family before you travel. Complete these steps to stay safe from cyber threats abroad.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-slate-800 dark:bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Progress</h3>
                    <p className="text-slate-300">{completedCount} of {totalItems} items completed</p>
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <div className="flex justify-between text-sm text-slate-300 mb-1">
                    <span>Readiness</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-400" />
            Pre-Flight Security Checklist
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {preFlightChecklist.map((category, catIndex) => (
              <Card key={catIndex} className="bg-slate-800/70 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => {
                      const itemId = `${catIndex}-${itemIndex}`;
                      const isCompleted = completedItems.has(itemId);
                      return (
                        <button
                          key={itemIndex}
                          onClick={() => toggleItem(itemId)}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${
                            isCompleted 
                              ? "bg-green-900/30 border border-green-500/30" 
                              : "bg-slate-700/50 hover:bg-slate-700 border border-transparent"
                          }`}
                        >
                          <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isCompleted 
                              ? "bg-green-500 border-green-500" 
                              : "border-slate-500"
                          }`}>
                            {isCompleted && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm ${isCompleted ? "text-green-300 line-through" : "text-slate-200"}`}>
                              {item.task}
                            </span>
                            {item.priority === "critical" && !isCompleted && (
                              <span className="ml-2 text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                                Critical
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            Tourist-Targeted Scams to Watch For
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {touristScams.map((scam, index) => (
              <Card key={index} className="bg-slate-800/70 border-slate-700 hover:border-amber-500/30 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <scam.icon className="h-5 w-5 text-amber-400" />
                    {scam.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-3">{scam.description}</p>
                  <div className="text-xs text-slate-400 mb-3">
                    <span className="font-medium text-slate-300">Common locations:</span> {scam.locations}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-green-400">How to stay safe:</span>
                    {scam.prevention.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-slate-800/70 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-6 w-6 text-blue-400" />
                US Embassy Contacts by Destination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">
                Save your destination's embassy contact before you travel. In an emergency abroad, the embassy can help with lost passports, medical emergencies, or if you're a victim of crime.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Select Region</label>
                  <Select value={selectedRegion} onValueChange={(val) => { setSelectedRegion(val); setSelectedCountry(""); }}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Choose a region..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {Object.keys(embassyContacts).map(region => (
                        <SelectItem key={region} value={region} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Select Country</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={!selectedRegion}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white disabled:opacity-50">
                      <SelectValue placeholder={selectedRegion ? "Choose a country..." : "Select region first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 max-h-[300px]">
                      {countriesForRegion.map(country => (
                        <SelectItem key={country.country} value={country.country} className="text-white hover:bg-slate-700 focus:bg-slate-700">
                          {country.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedEmbassy ? (
                <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-500/30">
                  <h4 className="text-lg font-semibold text-white mb-4">{selectedEmbassy.embassy}</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-800/80 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">General Inquiries</div>
                      <div className="text-blue-400 font-mono">{selectedEmbassy.phone}</div>
                    </div>
                    <div className="bg-slate-800/80 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-1">Emergency (24/7)</div>
                      <div className="text-amber-400 font-mono">{selectedEmbassy.emergency}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">
                    Save this number in your phone before traveling. Embassy staff can assist with passport emergencies, medical crises, and crime victim assistance. Always verify current contact details at{" "}
                    <a href="https://www.usembassy.gov" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">usembassy.gov</a>{" "}
                    before your trip, as phone numbers may change.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select your destination to see embassy contacts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-800 dark:bg-slate-800 border-slate-700">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <Phone className="h-10 w-10 text-teal-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Need Emergency Contacts for Your Destination?</h3>
                    <p className="text-slate-300">
                      Our Emergency Help page has local police, cybercrime units, banking hotlines, and mobile money fraud contacts for 50+ countries worldwide.
                    </p>
                  </div>
                </div>
                <Link href="/emergency-help">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white gap-2 whitespace-nowrap">
                    View Emergency Contacts
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
