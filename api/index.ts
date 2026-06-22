import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

app.post("/api/gemini/generate-match-report", async (req, res) => {
  try {
    const { match, players } = req.body;
    if (!match || !players) {
      return res.status(400).json({ error: "Missing match or players details in request." });
    }

    const ai = getGeminiClient();
    const prompt = `Hãy soạn một bài viết phân tích chi tiết (Match Report) cho trận đấu gần đây thuộc giải đấu Akari League (Mùa 3 - Tam Hùng Tranh Bá).
Thông tin trận đấu:
- Vòng đấu: ${match.round}
- Đội A: ${match.teamA} (Số bàn thắng: ${match.scoreA})
- Đội B: ${match.teamB} (Số bàn thắng: ${match.scoreB})
- Ngày thi đấu: ${match.date}
- Diễn biến trận đấu (Sự kiện): ${JSON.stringify(match.events)}
Danh sách các cầu thủ tham gia (tên, đội bóng, vị trí, đội trưởng): ${JSON.stringify(players)}

Xin hãy chọn ngẫu nhiên một trong 3 bình luận viên bóng đá nổi tiếng Việt Nam dưới đây để viết bài phân tích với giọng điệu đặc sắc đặc trưng riêng của họ:
1. BLV Quang Huy (avatar: "H", màu sắc đại diện: "#ef4444", phong cách: "passionate" - Sôi động, nhiệt huyết, kịch tính, dùng các cụm từ bùng nổ, ca ngợi nỗ lực tuyệt vời và cảm xúc sân cỏ).
2. BLV Quang Tùng (avatar: "T", màu sắc đại diện: "#3b82f6", phong cách: "analytical" - Phân tích chiến thuật sâu sắc, sắc sảo, cự ly đội hình, khả năng kiểm soát bóng, chuyển đổi trạng thái giữa trung lộ và biên).
3. BLV Anh Ngọc (avatar: "N", màu sắc đại diện: "#a855f7", phong cách: "poetic" - Lãng mạn, thơ mộng, hoài niệm Ý cổ kính, xem trái bóng và trận đấu như một buổi biểu diễn tranh thủy mặc, so sánh ví von bay bổng).

Bài viết cần đề cập đến tên một số cầu thủ nổi bật ghi bàn hoặc nhận thẻ trong sự kiện trận đấu này nếu có.

Hãy xuất ra định dạng JSON chính xác theo cấu trúc sau:
{
  "title": "Tiêu đề bài phân tích cực kỳ thu hút, giật gân nhưng chuyên nghiệp bằng tiếng Việt",
  "content": "Nội dung bài viết phân tích bằng tiếng Việt gồm khoảng 3-5 câu chất lượng, viết chuẩn mực dưới phong cách độc quyền bình luận viên đã chọn",
  "commentator": {
    "name": "Tên bình luận viên viết bài (Ví dụ: BLV Quang Huy)",
    "avatar": "Ký tự 'H' hoặc 'T' hoặc 'N' đại diện cho bình luận viên đã chọn",
    "color": "Màu sắc tương ứng tương thích ('#ef4444' hoặc '#3b82f6' hoặc '#a855f7')",
    "style": "Phong cách tương ứng ('passionate' hoặc 'analytical' hoặc 'poetic')"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            commentator: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                avatar: { type: Type.STRING },
                color: { type: Type.STRING },
                style: { type: Type.STRING }
              },
              required: ["name", "avatar", "color", "style"]
            }
          },
          required: ["title", "content", "commentator"]
        }
      }
    });

    if (!response.text) throw new Error("No text response received from Gemini.");
    return res.json(JSON.parse(response.text.trim()));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Không thể tự động phân tích qua AI" });
  }
});

app.post("/api/gemini/generate-round-summary", async (req, res) => {
  try {
    const { round, roundMatches, players } = req.body;
    if (round === undefined || !roundMatches || !players) {
      return res.status(400).json({ error: "Missing round data, roundMatches or players info." });
    }

    const ai = getGeminiClient();
    const prompt = `Hãy soạn thảo một Bản Tin Tổng Hợp Vòng Đấu (Round Summary Bulletin) cho Vòng ${round} của giải đấu Akari League (Mùa 3 - Tam Hùng Tranh Bá).
Thông tin vòng đấu:
- Vòng số: ${round}
- Danh sách tất cả các trận đấu của vòng: ${JSON.stringify(roundMatches)}
- Danh sách các cầu thủ tham gia giải: ${JSON.stringify(players)}

Nhiệm vụ của bạn:
1. Tổng hợp kết quả chung của các trận đấu trong vòng ${round}.
2. ĐÁNH GIÁ CHI TIẾT phong độ của CÁC CẦU THỦ NỔI BẬT trong vòng (dựa trên số bàn thắng, thẻ phạt trong trận). Hãy nêu đích danh tên cầu thủ.
3. Đưa ra DỰ ĐOÁN, nhận định và lời khuyên chiến thuật cho vòng đấu tiếp theo (Vòng ${Number(round) + 1}).

Hãy sinh ra lời bình luận chuyên biệt từ BA bình luận viên huyền thoại Việt Nam, mỗi người sẽ tập trung vào một khía cạnh và mang đậm giọng điệu thương hiệu của họ:
1. BLV Quang Huy (phong cách "passionate" - Sôi động, nhiệt huyết): Tổng hợp diễn biến, kết quả vòng đấu vừa qua một cách bốc lửa, ca tụng lòng quả cảm và khí thế thi đấu của các đội.
2. BLV Quang Tùng (phong cách "analytical" - Phân tích chiến thuật, sắc sảo): Tập trung đánh giá phong độ cá nhân của các cầu thủ xuất sắc hoặc mờ nhạt, phân tích chiến thuật, số liệu bàn thắng/thẻ phạt của họ đóng góp cho đội.
3. BLV Anh Ngọc (phong cách "poetic" - Lãng mạn, nên thơ): Đưa ra nhận định và dự đoán cho vòng đấu tiếp theo bằng giọng văn lãng mạn, ví von bóng đá như nghệ thuật và đưa ra viễn cảnh nên thơ cho loạt trận tới.

Yêu cầu xuất ra định dạng JSON chuẩn theo schema sau:
{
  "title": "Tiêu đề hoành tráng phong cách thời báo bóng đá thể thao tổng hợp Vòng ${round} (tiếng Việt)",
  "comments": [
    {
      "name": "BLV Quang Huy",
      "avatar": "H",
      "role": "Sôi động - Đột phá",
      "color": "#ef4444",
      "style": "passionate",
      "comment": "Nội dung bình luận bốc lửa của BLV Quang Huy về chiến tích Vòng ${round}..."
    },
    {
      "name": "BLV Quang Tùng",
      "avatar": "T",
      "role": "Phân tích chiến thuật",
      "color": "#3b82f6",
      "style": "analytical",
      "comment": "Nội dung đánh giá chiến thuật cực sâu sắc của BLV Quang Tùng về Vòng ${round}..."
    },
    {
      "name": "BLV Anh Ngọc",
      "avatar": "N",
      "role": "Lãng mạn phong vị Ý",
      "color": "#a855f7",
      "style": "poetic",
      "comment": "Nội dung tản văn lãng mạn bay bổng của BLV Anh Ngọc ví von vẻ đẹp Vòng ${round}..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            comments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  avatar: { type: Type.STRING },
                  role: { type: Type.STRING },
                  color: { type: Type.STRING },
                  style: { type: Type.STRING },
                  comment: { type: Type.STRING }
                },
                required: ["name", "avatar", "role", "color", "style", "comment"]
              }
            }
          },
          required: ["title", "comments"]
        }
      }
    });

    if (!response.text) throw new Error("No text response received from Gemini.");
    return res.json(JSON.parse(response.text.trim()));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Không thể tự động tổng hợp vòng qua AI" });
  }
});

export default app;
