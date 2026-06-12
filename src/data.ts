import { Player, Match, Penalty, Finance, Rule, News, TeamStanding, RoundTeamStanding, MatchEvent, NewsComment } from './types';

export const TEAMS = ['Sodapop', 'Chiến Lang', 'Youth Flowers'];

export const INITIAL_PLAYERS: Player[] = [
  // Sodapop (12 players)
  { id: 'p1', name: 'Hoàng Huy', number: 1, team: 'Sodapop', position: 'Tiền đạo', isCaptain: true, goals: 3, yellowCards: 1, redCards: 0 },
  { id: 'p2', name: 'Thanh Tân', number: 2, team: 'Sodapop', position: 'Tiền đạo', isCaptain: false, goals: 4, yellowCards: 0, redCards: 0 },
  { id: 'p3', name: 'Nguyên', number: 3, team: 'Sodapop', position: 'Thủ môn', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p4', name: 'Du', number: 4, team: 'Sodapop', position: 'Hậu vệ', isCaptain: false, goals: 1, yellowCards: 2, redCards: 0 },
  { id: 'p_sp_5', name: 'Trí Già', number: 5, team: 'Sodapop', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_sp_6', name: 'Bee', number: 6, team: 'Sodapop', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_sp_7', name: 'Linh', number: 7, team: 'Sodapop', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_sp_8', name: 'Quân', number: 8, team: 'Sodapop', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_sp_9', name: 'Vương', number: 9, team: 'Sodapop', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_sp_10', name: 'Dân', number: 10, team: 'Sodapop', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_sp_11', name: 'Trí Gây Mê', number: 11, team: 'Sodapop', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_sp_12', name: 'Ấn', number: 12, team: 'Sodapop', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },

  // Chiến Lang (13 players)
  { id: 'p5', name: 'Bình', number: 1, team: 'Chiến Lang', position: 'Tiền đạo', isCaptain: true, goals: 5, yellowCards: 0, redCards: 0 },
  { id: 'p6', name: 'Anh Tú', number: 2, team: 'Chiến Lang', position: 'Tiền vệ', isCaptain: false, goals: 2, yellowCards: 1, redCards: 0 },
  { id: 'p7', name: 'Only', number: 3, team: 'Chiến Lang', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 1 },
  { id: 'p8', name: 'Mỹ', number: 4, team: 'Chiến Lang', position: 'Thủ môn', isCaptain: false, goals: 0, yellowCards: 1, redCards: 0 },
  { id: 'p_cl_5', name: 'Tâm Thái', number: 5, team: 'Chiến Lang', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_cl_6', name: 'Vinh', number: 6, team: 'Chiến Lang', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_cl_7', name: 'Nghĩa', number: 7, team: 'Chiến Lang', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_cl_8', name: 'Thành', number: 8, team: 'Chiến Lang', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_cl_9', name: 'Bảo', number: 9, team: 'Chiến Lang', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_cl_10', name: 'Nhật Hòa', number: 10, team: 'Chiến Lang', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_cl_11', name: 'Đức', number: 11, team: 'Chiến Lang', position: 'Tiền đạo', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_cl_12', name: 'Minh Nghi', number: 12, team: 'Chiến Lang', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_cl_13', name: 'Quý', number: 13, team: 'Chiến Lang', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },

  // Youth Flowers (13 players)
  { id: 'p_yf_1', name: 'Hùng Anh', number: 1, team: 'Youth Flowers', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p9', name: 'Dương Vũ', number: 2, team: 'Youth Flowers', position: 'Tiền vệ', isCaptain: true, goals: 1, yellowCards: 0, redCards: 0 },
  { id: 'p_yf_3', name: 'Tuấn Anh', number: 3, team: 'Youth Flowers', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_yf_4', name: 'Tài', number: 4, team: 'Youth Flowers', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_yf_5', name: 'Phát', number: 5, team: 'Youth Flowers', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_yf_6', name: 'Khoa', number: 6, team: 'Youth Flowers', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_yf_7', name: 'Dũng', number: 7, team: 'Youth Flowers', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_yf_8', name: 'Hào', number: 8, team: 'Youth Flowers', position: 'Hậu vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_yf_9', name: 'Tuyên', number: 9, team: 'Youth Flowers', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p10', name: 'Nam Khánh', number: 10, team: 'Youth Flowers', position: 'Tiền đạo', isCaptain: false, goals: 6, yellowCards: 1, redCards: 0 },
  { id: 'p11', name: 'Tùng', number: 11, team: 'Youth Flowers', position: 'Tiền vệ', isCaptain: false, goals: 0, yellowCards: 3, redCards: 0 },
  { id: 'p12', name: 'Trọng Phú', number: 12, team: 'Youth Flowers', position: 'Thủ môn', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 },
  { id: 'p_yf_13', name: 'Dũng Già', number: 13, team: 'Youth Flowers', position: 'Tiền đạo', isCaptain: false, goals: 0, yellowCards: 0, redCards: 0 }
];

export const INITIAL_RULES: Rule[] = [
  {
    id: 'r1',
    title: '1. Thuật toán tính điểm 2 lớp',
    detail: 'Điểm từng trận: Thắng (+2), Hòa (+1), Thua (0). Dựa vào điểm này để xếp hạng vòng. Đội hạng 1 vòng (+2 điểm tổng), Hạng 2 (+1 điểm tổng), Hạng 3 (0 điểm) vào Bảng Xếp Hạng Tổng.\n\nNếu có hai đội bằng điểm, bằng hiệu số ở cuối vòng thì kết quả loạt Penalty Tie-break sẽ được dùng làm căn cứ quyết định.'
  },
  {
    id: 'r2',
    title: '2. Đăng ký danh sách thi đấu',
    detail: 'Mỗi đội tuyển đăng ký tối đa 15 cầu thủ, tối thiểu 7 cầu thủ chính thức. Danh sách đăng ký phải được ban tổ chức chốt tối thiểu 48 tiếng trước khi lượt thi đấu chính thức bắt đầu.'
  },
  {
    id: 'r3',
    title: '3. Quy chế Quỹ đội và Kỷ luật đóng góp',
    detail: 'Quỹ chung giải đấu được dùng để chi trả cho các hoạt động: Thuê sân vận động, chuẩn bị nước uống, đá lạnh phục vụ các lượt trận, và đầu tư y tế.\n\nMức phí đóng góp tối thiểu: 200,000 VND / thành viên / tháng. Thành viên đóng muộn sau ngày 10 hàng tháng sẽ phải chịu mức phạt bổ sung 50,000 VND phục vụ quỹ liên hoan.'
  }
];

export const INITIAL_FINANCES: Finance[] = [
  { id: 'f1', date: '2026-06-01', content: 'Đóng tiền quỹ tháng 6 - Đội Sodapop', revenue: 1500000, expense: 0 },
  { id: 'f2', date: '2026-06-01', content: 'Đóng tiền quỹ tháng 6 - Đội Chiến Lang', revenue: 1500000, expense: 0 },
  { id: 'f3', date: '2026-06-02', content: 'Đóng tiền quỹ tháng 6 - Đội Youth Flowers', revenue: 1500000, expense: 0 },
  { id: 'f4', date: '2026-06-05', content: 'Thanh toán tiền thuê sân vận động tháng 6', revenue: 0, expense: 2100000 },
  { id: 'f5', date: '2026-06-08', content: 'Mua nước khoáng uống tập trung và túi chườm lạnh vòng 1', revenue: 0, expense: 280000 }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    round: 1,
    teamA: 'Sodapop',
    teamB: 'Chiến Lang',
    scoreA: 3,
    scoreB: 2,
    date: '2026-06-08',
    events: [
      { team: 'Sodapop', playerId: 'p1', type: 'goal' },
      { team: 'Sodapop', playerId: 'p2', type: 'goal' },
      { team: 'Chiến Lang', playerId: 'p5', type: 'goal' },
      { team: 'Sodapop', playerId: 'p1', type: 'goal' },
      { team: 'Chiến Lang', playerId: 'p6', type: 'goal' },
      { team: 'Sodapop', playerId: 'p4', type: 'yellow' },
      { team: 'Chiến Lang', playerId: 'p7', type: 'yellow' }
    ]
  },
  {
    id: 'm2',
    round: 1,
    teamA: 'Chiến Lang',
    teamB: 'Youth Flowers',
    scoreA: 1,
    scoreB: 4,
    date: '2026-06-08',
    events: [
      { team: 'Youth Flowers', playerId: 'p10', type: 'goal' },
      { team: 'Youth Flowers', playerId: 'p10', type: 'goal' },
      { team: 'Chiến Lang', playerId: 'p5', type: 'goal' },
      { team: 'Youth Flowers', playerId: 'p10', type: 'goal' },
      { team: 'Youth Flowers', playerId: 'p9', type: 'goal' },
      { team: 'Chiến Lang', playerId: 'p8', type: 'yellow' },
      { team: 'Youth Flowers', playerId: 'p11', type: 'yellow' }
    ]
  },
  {
    id: 'm3',
    round: 1,
    teamA: 'Youth Flowers',
    teamB: 'Sodapop',
    scoreA: 2,
    scoreB: 2,
    date: '2026-06-09',
    events: [
      { team: 'Sodapop', playerId: 'p2', type: 'goal' },
      { team: 'Youth Flowers', playerId: 'p10', type: 'goal' },
      { team: 'Sodapop', playerId: 'p4', type: 'goal' },
      { team: 'Youth Flowers', playerId: 'p10', type: 'goal' },
      { team: 'Sodapop', playerId: 'p4', type: 'yellow' },
      { team: 'Youth Flowers', playerId: 'p11', type: 'yellow' }
    ]
  }
];

export const INITIAL_PENALTIES: Penalty[] = [];

export const INITIAL_NEWS: News[] = [
  {
    id: 'n1',
    round: 1,
    type: 'round_summary',
    date: '2026-06-10',
    title: 'Tổng Hợp Vòng 1: Cơn Mưa Bàn Thắng Và Vĩ Thanh Của Những Cánh Hoa',
    comments: [
      {
        avatar: 'H',
        name: 'BLV Quang Huy',
        role: 'Sôi động - Đột phá',
        color: '#ef4444',
        style: 'passionate',
        comment: 'Thưa quý vị và các bạn! Thật không thể tin nổi chúng ta lại được chứng kiến một vòng đấu mở màn rực lửa đến như vậy! Tổng cộng có tới 14 bàn thắng được ghi chỉ sau 3 trận đấu. Sức mạnh bốc lửa của Youth Flowers, đặc biệt là họng pháo Phan Hồng Sơn với 5 pha lập công xứng đáng nhận điểm 10 từ giới chuyên môn. Đây chắc chắn là mùa giải đáng xem nhất lịch sử RandomLeague!'
      },
      {
        avatar: 'T',
        name: 'BLV Quang Tùng',
        role: 'Phân tích chiến thuật',
        color: '#3b82f6',
        style: 'analytical',
        comment: 'Nếu nhìn vào khía cạnh chiến thuật thi đấu, sự cân bằng chính là yếu tố làm nên BXH vòng này. Youth Flowers thể hiện khả năng chuyển trạng thái cực nhanh. Sodapop chơi kiểm soát bóng khá ổn định nhưng cự ly đội hình ở những hiệp 2 cần được cải thiện. Điểm mấu chốt của sơ đồ 3-4-3 bên phía Chiến Lang là sự bọc lót giữa trung vệ lệch và tiền vệ quét chưa thực sự ăn khớp, dẫn đến việc họ nhận nhiều bàn thua sập hầm.'
      },
      {
        avatar: 'N',
        name: 'BLV Anh Ngọc',
        role: 'Lãng mạn phong vị Ý',
        color: '#a855f7',
        style: 'poetic',
        comment: 'Giữa cái nắng hè rực rỡ, trái bóng RandomLeague lăn như một bài ca tình yêu lãng mạn. Giống như những chiều hoàng hôn trên quảng trường Piazza del Popolo thơ mộng, trận hòa 2-2 giữa Youth Flowers và Sodapop mang đầy đủ thi vị của kịch tính và sự hào hoa. Bóng đá không chỉ là những con số cơ học, nó là những khoảnh khắc lãng đãng thăng hoa làm thổn thức hàng ngàn con tim!'
      }
    ]
  }
];

// Calculation Functions

/**
 * Calculates Round standings & Overall standings based on rules.
 */
export function calculateLeagueRankings(matches: Match[], penalties: Penalty[]): {
  overall: TeamStanding[];
  rounds: { [round: number]: RoundTeamStanding[] };
} {
  const roundNumbers = Array.from(new Set(matches.map(m => m.round))).sort((a,b) => a - b);
  const roundsRankings: { [round: number]: RoundTeamStanding[] } = {};

  // Initialize overall standing indicators
  const overallMap: { [team: string]: { roundsPlayed: number; diff: number; points: number } } = {};
  TEAMS.forEach(team => {
    overallMap[team] = { roundsPlayed: 0, diff: 0, points: 0 };
  });

  roundNumbers.forEach(rNum => {
    const roundMatches = matches.filter(m => m.round === rNum);
    if (roundMatches.length === 0) return;

    // Create stand state for this round
    const roundState: { [team: string]: RoundTeamStanding } = {};
    TEAMS.forEach(team => {
      roundState[team] = {
        team,
        played: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        matchPts: 0,
        penaltyWins: 0
      };
    });

    // Check penalty tie breakers in this round
    const roundPens = penalties.filter(p => p.round === rNum);
    roundPens.forEach(p => {
      if (p.scoreA > p.scoreB) {
        if (roundState[p.teamA]) roundState[p.teamA].penaltyWins += 1;
      } else if (p.scoreB > p.scoreA) {
        if (roundState[p.teamB]) roundState[p.teamB].penaltyWins += 1;
      }
    });

    // Calculate match points in this round
    roundMatches.forEach(m => {
      const { teamA, teamB, scoreA, scoreB } = m;
      if (!roundState[teamA] || !roundState[teamB]) return;

      roundState[teamA].played += 1;
      roundState[teamB].played += 1;
      roundState[teamA].gf += scoreA;
      roundState[teamA].ga += scoreB;
      roundState[teamB].gf += scoreB;
      roundState[teamB].ga += scoreA;
      
      roundState[teamA].gd = roundState[teamA].gf - roundState[teamA].ga;
      roundState[teamB].gd = roundState[teamB].gf - roundState[teamB].ga;

      if (scoreA > scoreB) {
        roundState[teamA].matchPts += 2;
      } else if (scoreA < scoreB) {
        roundState[teamB].matchPts += 2;
      } else {
        roundState[teamA].matchPts += 1;
        roundState[teamB].matchPts += 1;
      }
    });

    // Sort teams for this round
    const sortedRoundTeams = Object.values(roundState).sort((a, b) => {
      if (b.matchPts !== a.matchPts) return b.matchPts - a.matchPts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      // Use penalty tie-breaker
      return b.penaltyWins - a.penaltyWins;
    });

    roundsRankings[rNum] = sortedRoundTeams;

    // Distribute points to overall table
    // Rank 1: +2 pts, Rank 2: +1 pt, Rank 3: 0 pts
    sortedRoundTeams.forEach((teamStand, idx) => {
      const overallTeam = overallMap[teamStand.team];
      if (overallTeam) {
        // Increment rounds played if they played in this round
        if (teamStand.played > 0) {
          overallTeam.roundsPlayed += 1;
        }
        overallTeam.diff += teamStand.gd;

        if (idx === 0) {
          overallTeam.points += 2;
        } else if (idx === 1) {
          overallTeam.points += 1;
        } else {
          overallTeam.points += 0;
        }
      }
    });
  });

  // Convert overall map to sorted array
  const overallStandings: TeamStanding[] = TEAMS.map(team => ({
    team,
    roundsPlayed: overallMap[team].roundsPlayed,
    diff: overallMap[team].diff,
    points: overallMap[team].points
  })).sort((a,b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.diff - a.diff; // Goal difference fallback
  });

  return {
    overall: overallStandings,
    rounds: roundsRankings
  };
}

/**
 * Helper to dynamically generate nice report copy about a single match locally
 */
export function generateLocalMatchReport(match: Match, allPlayers: Player[]): News {
  const cNames = ['BLV Quang Huy', 'BLV Quang Tùng', 'BLV Anh Ngọc'];
  const styles: ('passionate' | 'analytical' | 'poetic')[] = ['passionate', 'analytical', 'poetic'];
  const colors = ['#ef4444', '#3b82f6', '#a855f7'];
  const avatars = ['H', 'T', 'N'];
  
  // Pick one random commentator
  const idx = Math.floor(Math.random() * 3);
  const commentator = {
    name: cNames[idx],
    avatar: avatars[idx],
    color: colors[idx],
    style: styles[idx]
  };

  const getScorersString = () => {
    const goals = match.events.filter(e => e.type === 'goal');
    if (goals.length === 0) return 'không có bàn thắng nào';
    const names = goals.map(g => {
      const p = allPlayers.find(x => x.id === g.playerId);
      return p ? `${p.name} (${p.team})` : '';
    }).filter(Boolean);
    return names.join(', ');
  };

  let title = `Trận Phân Tranh Căng Thẳng: ${match.teamA} ${match.scoreA} - ${match.scoreB} ${match.teamB}`;
  let content = '';

  if (match.scoreA > match.scoreB) {
    title = `${match.teamA} Khuất Phục ${match.teamB} Trong Cơn Mưa Bàn Thắng Vòng ${match.round}`;
  } else if (match.scoreA < match.scoreB) {
    title = `Cú Lội Ngược Dòng Quả Cảm Của ${match.teamB} Trước ${match.teamA} Tại Vòng ${match.round}`;
  } else {
    title = `Rượt Đuổi Tỉ Số Căng Thẳng: ${match.teamA} Chia Điểm Tiếc Nuối Với ${match.teamB}`;
  }

  const scorers = getScorersString();

  if (commentator.style === 'passionate') {
    content = `Ôi tuyệt vời, một trận đấu rực lửa mãn nhãn ở vòng ${match.round}! ${match.teamA} và ${match.teamB} đã dâng hiến cho các cổ động viên một kịch bản không thể lôi cuốn hơn. Các bàn thắng được ghi bởi ${scorers} đã làm rung chuyển cầu trường. Chiến thắng chung cuộc xứng đáng thuộc về bên bản lĩnh hơn, một tinh thần thể thao tuyệt diệu tinh khiết của RandomLeague!`;
  } else if (commentator.style === 'analytical') {
    content = `Dưới lăng kính chuyên môn nghiệp vụ bóng đá, trận đấu vòng ${match.round} này phản ánh chuẩn xác những toan tính chiến thuật. Khả năng kiểm soát khu trung tuyến và kéo giãn biên giúp khai thông bế tắc cực kỳ logic. Điểm nhấn ghi bàn từ ${scorers} cho thấy tính hiệu quả đặc biệt trong khâu dứt điểm cuối cùng. Trận đấu khép lại tỉ số ${match.scoreA}-${match.scoreB} hoàn toàn phản ánh đúng cục diện thực tế tại sân cỏ.`;
  } else {
    content = `Bóng đá như một bức họa thẫm đẫm chất thơ, và hôm nay cả hai đội đã vẽ nên một bức thủy mặc lãng mạn tại vòng ${match.round}. Khi trái bóng vẽ nên những đường cong tuyệt mĩ dệt nên các bàn thắng điệu đàng từ chân của ${scorers}, khán giả cảm tưởng đang thưởng thức khúc ca chiều lộng gió hoài niệm Rome thơ mộng. Một tỉ số đầy quyến rũ mang hơi thở nghệ thuật say lòng người.`;
  }

  return {
    id: `news_m_${match.id}_${Date.now()}`,
    round: match.round,
    type: 'match',
    date: match.date,
    title,
    content,
    commentator
  };
}

/**
 * Check if the round matches are fully completed (3 matches per round for 3 teams is actually 3 combinations? Wait.
 * In a round of 3 teams, if each plays each other, there are exactly 3 matches!
 * Sodapop vs Chiến Lang, Chiến Lang vs Youth Flowers, Youth Flowers vs Sodapop.
 * So indeed a complete round has exactly 3 matches! Excellent deduction).
 */
export function isRoundComplete(round: number, matches: Match[]): boolean {
  return matches.filter(m => m.round === round).length === 3;
}

/**
 * Programmatically compile comments from all 3 commentators for a round summary
 */
export function generateLocalRoundSummary(round: number, matches: Match[], allPlayers: Player[]): News {
  const roundMatches = matches.filter(m => m.round === round);
  const { overall, rounds } = calculateLeagueRankings(matches, []);
  const roundStandings = rounds[round] || [];
  
  if (roundStandings.length === 0) {
    return {
      id: `news_r_${round}`,
      round,
      type: 'round_summary',
      date: new Date().toISOString().split('T')[0],
      title: `Bản Tin Tổng Hợp Kết Quả Vòng ${round}`,
      comments: []
    };
  }

  const championTeam = roundStandings[0]?.team || 'Chưa rõ';
  const scoreSummary = roundMatches.map(m => `${m.teamA} ${m.scoreA}-${m.scoreB} ${m.teamB}`).join(', ');

  const comments: NewsComment[] = [
    {
      avatar: 'H',
      name: 'BLV Quang Huy',
      role: 'Sôi động - Đột phá',
      color: '#ef4444',
      style: 'passionate',
      comment: `Nhiệt liệt chúc mừng đội tuyển ${championTeam} đã bứt phá xuất sắc đứng đầu bảng xếp hạng Vòng ${round}! Một hành trình quá giật gân đầy xúc cảm cuồng nhiệt qua các tỉ số đấu đầu căng thẳng: ${scoreSummary}. Các chàng trai đã chơi một thứ bóng đá cống hiến hết mình, tràn đầy dũng khí võ sĩ trung kiên. Thật tự hào và hào hứng đón chờ những màn trình diễn vô tiền khoáng hậu sắp tới!`
    },
    {
      avatar: 'T',
      name: 'BLV Quang Tùng',
      role: 'Phân tích chiến thuật',
      color: '#3b82f6',
      style: 'analytical',
      comment: `Nhìn nhận chuyên sâu khoa học, cục diện Vòng ${round} phân nhóm rất rõ rệt. Đội tuyển đứng đầu là ${championTeam} đã tận dụng hợp lý chiến thuật cự ly hẹp phòng ngự phản công chủ động, gia tăng tuyệt vời điểm số tối đa. Trong khi đó, các đội xếp sau lộ điểm yếu chết người ở khả năng chuyển trạng thái trung lộ yếu ớt và thiếu nhân tố đột biến cá nhân cầm trịch nhịp độ rượt đuổi.`
    },
    {
      avatar: 'N',
      name: 'BLV Anh Ngọc',
      role: 'Lãng mạn phong vị Ý',
      color: '#a855f7',
      style: 'poetic',
      comment: `Một bức tranh thu lộng lẫy và tràn trề cảm xúc kiêu hãnh rải rác trên thảm cỏ xanh mướt Vòng ${round}! Khi chứng kiến ${championTeam} thăng hoa giạt dào như dòng nước trong lành chảy dọc bán đảo Chianti mộng mơ cổ kính, trái tim chúng ta rung lên những nhịp đập thổn thức kỳ diệu của chân thiện mỹ. Hãy đắm chìm trong men say diệu kỳ này, vì bóng đá vốn dĩ là đóa hoa rực rỡ dâng đời thơ mộng!`
    }
  ];

  return {
    id: `news_r_${round}_${Date.now()}`,
    round,
    type: 'round_summary',
    date: new Date().toISOString().split('T')[0],
    title: `Tổng Hợp Chiến Tích Vòng ${round}: Vinh Quang Gọi Tên ${championTeam}`,
    comments
  };
}
