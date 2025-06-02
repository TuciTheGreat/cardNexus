import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Banlist = () => {
  const [banlist, setBanlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTypeOrder = (type) => {
    const t = type.toLowerCase();
    if (t === "normal monster") return 0;
    if (t === "effect monster" && !t.includes("fusion") && !t.includes("link") && !t.includes("synchro") && !t.includes("xyz")) return 1;
    if (t.includes("fusion monster")) return 2;
    if (t.includes("link monster")) return 3;
    if (t.includes("synchro monster")) return 4;
    if (t.includes("xyz monster")) return 5;
    if (t.includes("spell card")) return 6;
    if (t.includes("trap card")) return 7;
    return 8;
  };

  useEffect(() => {
    const fetchBanlist = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php?banlist=tcg"
        );
        let cards = data.data || [];
        cards.sort((a, b) => {
          const banOrder = { forbidden: 0, limited: 1, "semi-limited": 2 };
          const saRaw = a.banlist_info?.ban_tcg || "";
          const sbRaw = b.banlist_info?.ban_tcg || "";
          const sa = saRaw.toLowerCase();
          const sb = sbRaw.toLowerCase();
          const oaBan = banOrder[sa] ?? 3;
          const obBan = banOrder[sb] ?? 3;
          if (oaBan !== obBan) return oaBan - obBan;
          const ta = getTypeOrder(a.type || "");
          const tb = getTypeOrder(b.type || "");
          return ta - tb;
        });
        setBanlist(cards);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(
          err.response?.data?.error ||
          err.message ||
          "Грешка при зареждане на banlist"
        );
      }
    };
    fetchBanlist();
  }, []);

  return (
    <div className="banlist-container bg-gray-900 text-white min-h-screen pt-20">
      <div className="banlist-content p-6 lg:pl-64">
        <h2 className="text-3xl font-bold text-pink-400 mb-6">
          Официален Banlist (TCG)
        </h2>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-pink-300">
                    Име на карта
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-pink-300">
                    Изображение
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-pink-300">
                    Тип на картата
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-pink-300">
                    Тип banlist
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {banlist.map((card) => (
                  <tr
                    key={card.id}
                    className="hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-3 text-gray-200 break-words max-w-xs md:max-w-sm">
                      {card.name}
                    </td>
                    <td className="p-3">
                      <img
                        src={card.card_images?.[0]?.image_url || ""}
                        alt={card.name}
                        className="w-16 h-20 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-3 text-gray-200">{card.type}</td>
                    <td className="p-3 text-gray-200">
                      {card.banlist_info?.ban_tcg?.toLowerCase() || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banlist;
