import * as React from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { worlds, type PitfallCard, type PitfallWorld, type WorldId } from './src/data';
import { BrandMark, SymbolIcon } from './src/icons';

const colors = {
  bg: '#fff6ea',
  paper: '#fffaf2',
  ink: '#20171d',
  muted: '#70675f',
  line: '#ead9c6',
  soft: '#f3e7d7',
  red: '#e60023',
  red2: '#b80f26',
  dark: '#17110f',
  green: '#0e9f64'
};

const bottomNav = [
  { label: '世界', icon: 'compass' as const },
  { label: '路径', icon: 'alt' as const },
  { label: '投递', icon: 'voice' as const },
  { label: '房间', icon: 'room' as const },
  { label: '我的', icon: 'mark' as const }
];

export default function App() {
  const [activeWorldId, setActiveWorldId] = React.useState<WorldId>('campus');
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [publishOpen, setPublishOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<PitfallCard | null>(null);
  const [publishMode, setPublishMode] = React.useState('语音');
  const [toast, setToast] = React.useState('');

  const activeWorld = worlds.find((world) => world.id === activeWorldId) ?? worlds[0];

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 1800);
  }

  function openDetail(card: PitfallCard) {
    setSelectedCard(card);
    setDetailOpen(true);
  }

  function chooseWorld(world: PitfallWorld) {
    setActiveWorldId(world.id);
    showToast(`已进入：${world.label}世界`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />
      <View style={styles.appShell}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Header onPublish={() => setPublishOpen(true)} />
          <View style={styles.hero}>
            <View style={styles.eyebrow}><Text style={styles.eyebrowText}>Native App · 真实经验，刷出路</Text></View>
            <Text style={styles.heroTitle}>先选一个<Text style={styles.redText}>生活世界</Text>。</Text>
            <Text style={styles.lead}>这版不是网页预览，而是 Expo React Native 原生 App 工程。用户进入 App 后从真实生活世界开始，再进入材料链、翻译、回应和替代路线。</Text>
          </View>

          <View style={styles.worldGrid}>
            {worlds.map((world) => {
              const active = world.id === activeWorldId;
              return (
                <Pressable key={world.id} onPress={() => chooseWorld(world)} style={[styles.worldButton, active && styles.worldButtonActive]}>
                  <SymbolIcon name={world.id} size={25} color={active ? '#fff' : colors.ink} />
                  <Text style={[styles.worldLabel, active && styles.worldLabelActive]}>{world.label}</Text>
                  <Text style={[styles.worldSub, active && styles.worldLabelActive]}>{world.subtitle}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.worldNote}>
            <View style={[styles.noteStripe, { backgroundColor: activeWorld.accent }]} />
            <View style={styles.noteTextBox}>
              <Text style={styles.noteTitle}>{activeWorld.label}世界</Text>
              <Text style={styles.noteBody}>{activeWorld.note}</Text>
            </View>
          </View>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{activeWorld.label}现场</Text>
            <Pressable onPress={() => setPublishOpen(true)}><Text style={styles.sectionAction}>投递 Story</Text></Pressable>
          </View>

          <View style={styles.feed}>
            {activeWorld.cards.map((card) => (
              <FeedCard key={card.title} card={card} world={activeWorld} onDetail={() => openDetail(card)} onToast={showToast} />
            ))}
          </View>
        </ScrollView>

        <Pressable style={styles.fab} onPress={() => setPublishOpen(true)}><Text style={styles.fabText}>＋</Text></Pressable>
        <BottomNav onPublish={() => setPublishOpen(true)} />
      </View>

      <DetailModal visible={detailOpen} card={selectedCard} world={activeWorld} onClose={() => setDetailOpen(false)} />
      <PublishModal visible={publishOpen} mode={publishMode} setMode={setPublishMode} world={activeWorld} onClose={() => setPublishOpen(false)} onSubmit={() => { setPublishOpen(false); showToast('已生成 Story 草稿：下一步打码、翻译、补材料'); }} />
      {toast ? <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View> : null}
    </SafeAreaView>
  );
}

function Header({ onPublish }: { onPublish: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.mark}><BrandMark size={24} /></View>
        <View><Text style={styles.brandTitle}>Pitfall</Text><Text style={styles.brandSub}>小众点评网</Text></View>
      </View>
      <Pressable style={styles.iconButton} onPress={onPublish}><SymbolIcon name="voice" size={22} /></Pressable>
    </View>
  );
}

function FeedCard({ card, world, onDetail, onToast }: { card: PitfallCard; world: PitfallWorld; onDetail: () => void; onToast: (message: string) => void }) {
  const [same, setSame] = React.useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: world.accent }]}><Text style={styles.avatarText}>{card.avatar}</Text></View>
        <Text style={styles.cardWorld}>{world.label}</Text>
        <View style={styles.riskPill}><Text style={styles.riskText}>{card.risk}</Text></View>
      </View>
      <Text style={styles.cardTitle}>{card.title}</Text>
      <Text style={styles.cardBody}>{card.body}</Text>
      <View style={styles.tags}>{card.tags.map((tag) => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}</View>
      <View style={styles.actions}>
        <Pressable style={[styles.action, same && styles.actionOn]} onPress={() => { setSame(!same); onToast('已记录你的判断：我有同感'); }}><Text style={[styles.actionText, same && styles.actionTextOn]}>我有同感</Text></Pressable>
        <Pressable style={styles.action} onPress={onDetail}><Text style={styles.actionText}>看材料链</Text></Pressable>
        <Pressable style={styles.action} onPress={() => onToast('已进入替代路线') }><Text style={styles.actionText}>给替代</Text></Pressable>
      </View>
    </View>
  );
}

function DetailModal({ visible, card, world, onClose }: { visible: boolean; card: PitfallCard | null; world: PitfallWorld; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheet}>
          <View style={styles.grip} />
          <View style={styles.sheetHead}><Text style={styles.sheetTitle}>{card?.title ?? '对象详情'}</Text><Pressable style={styles.close} onPress={onClose}><Text style={styles.closeText}>×</Text></Pressable></View>
          {card ? <ScrollView showsVerticalScrollIndicator={false}>
            <Chain title="01 风险摘要" body={`${card.risk} · ${world.label}世界`} note={card.body} />
            <Chain title="02 材料链" body={card.tags.join(' / ')} note="材料默认打码；强指控必须保留原文、时间、主体关系和可核查截图。" />
            <View style={styles.chain}><Text style={styles.chainKicker}>03 原文 / 译文</Text><View style={styles.langBox}><Text style={styles.langLabel}>原文</Text><Text style={styles.langText}>{card.original}</Text></View><View style={styles.langBox}><Text style={styles.langLabel}>Translation</Text><Text style={styles.langText}>{card.translation}</Text></View></View>
            <Chain title="04 回应与替代" body={card.alternative} note="对象可回应或整改，但不能付费删除真实材料；每条负面经验都要引导用户寻找更好路线。" />
          </ScrollView> : null}
        </View>
      </View>
    </Modal>
  );
}

function PublishModal({ visible, mode, setMode, world, onClose, onSubmit }: { visible: boolean; mode: string; setMode: (mode: string) => void; world: PitfallWorld; onClose: () => void; onSubmit: () => void }) {
  const modes = ['语音', '照片', '文字', '链接'];
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheet}>
          <View style={styles.grip} />
          <View style={styles.sheetHead}><Text style={styles.sheetTitle}>30 秒投递 Story</Text><Pressable style={styles.close} onPress={onClose}><Text style={styles.closeText}>×</Text></Pressable></View>
          <View style={styles.modeGrid}>{modes.map((item) => <Pressable key={item} onPress={() => setMode(item)} style={[styles.mode, mode === item && styles.modeOn]}><Text style={[styles.modeText, mode === item && styles.modeTextOn]}>{item}</Text></Pressable>)}</View>
          <Text style={styles.inputLabel}>一句话说明你遇到的暗门</Text>
          <TextInput multiline placeholder="例如：合同没有写保录取，但销售一直用聊天记录承诺。" placeholderTextColor="#9a8c80" style={styles.textArea} />
          <View style={styles.formInfo}><Text style={styles.formInfoTitle}>所属世界</Text><Text style={styles.formInfoValue}>{world.label}</Text></View>
          <View style={styles.formInfo}><Text style={styles.formInfoTitle}>材料类型</Text><Text style={styles.formInfoValue}>合同 / 菜单 / 账单 / 聊天记录</Text></View>
          <Pressable style={styles.primary} onPress={onSubmit}><Text style={styles.primaryText}>生成卡片、打码并翻译</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Chain({ title, body, note }: { title: string; body: string; note: string }) {
  return <View style={styles.chain}><Text style={styles.chainKicker}>{title}</Text><Text style={styles.chainBody}>{body}</Text><Text style={styles.chainNote}>{note}</Text></View>;
}

function BottomNav({ onPublish }: { onPublish: () => void }) {
  return <View style={styles.bottomNav}>{bottomNav.map((item) => <Pressable key={item.label} onPress={item.label === '投递' ? onPublish : undefined} style={[styles.navItem, item.label === '世界' && styles.navItemOn]}><SymbolIcon name={item.icon} size={22} color={item.label === '世界' ? colors.red2 : '#7d7065'} /><Text style={[styles.navText, item.label === '世界' && styles.navTextOn]}>{item.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  appShell: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 112 },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 40, height: 40, borderRadius: 16, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  brandTitle: { fontSize: 20, fontWeight: '900', color: colors.ink, letterSpacing: -0.8 },
  brandSub: { fontSize: 10, fontWeight: '900', color: colors.muted, letterSpacing: 1 },
  iconButton: { width: 42, height: 42, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  hero: { paddingTop: 16, paddingBottom: 12 },
  eyebrow: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  eyebrowText: { color: colors.red2, fontSize: 11, fontWeight: '900' },
  heroTitle: { marginTop: 13, color: colors.ink, fontSize: 36, lineHeight: 38, fontWeight: '900', letterSpacing: -2.2 },
  redText: { color: colors.red },
  lead: { marginTop: 10, color: '#564c44', fontSize: 14, lineHeight: 22, fontWeight: '600' },
  worldGrid: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  worldButton: { width: '31.8%', minHeight: 86, borderRadius: 22, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', padding: 8 },
  worldButtonActive: { backgroundColor: colors.dark, borderColor: colors.dark },
  worldLabel: { marginTop: 5, color: colors.ink, fontSize: 13, fontWeight: '900' },
  worldSub: { marginTop: 2, color: colors.muted, fontSize: 9, fontWeight: '800', textAlign: 'center' },
  worldLabelActive: { color: '#fff' },
  worldNote: { marginTop: 13, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, borderRadius: 22, padding: 14, flexDirection: 'row', gap: 10 },
  noteStripe: { width: 5, borderRadius: 99 },
  noteTextBox: { flex: 1 },
  noteTitle: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  noteBody: { marginTop: 5, color: colors.muted, fontSize: 12.5, lineHeight: 18, fontWeight: '700' },
  sectionHead: { marginTop: 22, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 23, fontWeight: '900', color: colors.ink, letterSpacing: -1 },
  sectionAction: { color: colors.red2, fontSize: 12, fontWeight: '900' },
  feed: { gap: 12 },
  card: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: 28, padding: 15 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 36, height: 36, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  cardWorld: { color: colors.muted, fontSize: 12, fontWeight: '900' },
  riskPill: { marginLeft: 'auto', backgroundColor: '#ffe7eb', borderWidth: 1, borderColor: '#ffcbd4', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 5 },
  riskText: { color: colors.red2, fontSize: 11, fontWeight: '900' },
  cardTitle: { marginTop: 11, color: colors.ink, fontSize: 18, lineHeight: 22, fontWeight: '900', letterSpacing: -0.6 },
  cardBody: { marginTop: 7, color: '#5e554d', fontSize: 13, lineHeight: 19, fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 11 },
  tag: { height: 27, borderRadius: 999, backgroundColor: '#f5eadc', borderWidth: 1, borderColor: colors.line, paddingHorizontal: 9, alignItems: 'center', justifyContent: 'center' },
  tagText: { color: '#5d5148', fontSize: 11, fontWeight: '900' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  action: { minHeight: 39, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  actionOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  actionText: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  actionTextOn: { color: '#fff' },
  fab: { position: 'absolute', right: 18, bottom: 84, width: 58, height: 58, borderRadius: 23, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  fabText: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: -3 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 6, paddingHorizontal: 13, paddingTop: 9, paddingBottom: 11, backgroundColor: 'rgba(255,250,242,.96)', borderTopWidth: 1, borderTopColor: colors.line },
  navItem: { flex: 1, height: 56, borderRadius: 19, alignItems: 'center', justifyContent: 'center', gap: 3 },
  navItemOn: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line },
  navText: { color: '#7d7065', fontSize: 10, fontWeight: '900' },
  navTextOn: { color: colors.red2 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(23,17,15,.42)' },
  sheet: { maxHeight: '88%', backgroundColor: colors.paper, borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24 },
  grip: { width: 46, height: 5, borderRadius: 99, backgroundColor: '#d7c5b0', alignSelf: 'center', marginBottom: 12 },
  sheetHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  sheetTitle: { flex: 1, color: colors.ink, fontSize: 25, lineHeight: 29, fontWeight: '900', letterSpacing: -1.4 },
  close: { width: 38, height: 38, borderRadius: 15, backgroundColor: '#f0e4d4', alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.ink, fontSize: 24, lineHeight: 26 },
  chain: { marginTop: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, borderRadius: 22, padding: 13 },
  chainKicker: { color: colors.red2, fontSize: 11, fontWeight: '900' },
  chainBody: { marginTop: 4, color: colors.ink, fontSize: 15, fontWeight: '900' },
  chainNote: { marginTop: 5, color: colors.muted, fontSize: 12.5, lineHeight: 18, fontWeight: '600' },
  langBox: { marginTop: 9, backgroundColor: '#f7ecdd', borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 11 },
  langLabel: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  langText: { marginTop: 4, color: colors.ink, fontSize: 13, lineHeight: 18, fontWeight: '700' },
  modeGrid: { marginTop: 14, flexDirection: 'row', gap: 8 },
  mode: { flex: 1, minHeight: 58, borderRadius: 19, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  modeOn: { backgroundColor: colors.dark, borderColor: colors.dark },
  modeText: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  modeTextOn: { color: '#fff' },
  inputLabel: { marginTop: 14, marginLeft: 3, marginBottom: 7, color: '#5c5149', fontSize: 12, fontWeight: '900' },
  textArea: { minHeight: 96, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff', borderRadius: 19, padding: 13, color: colors.ink, textAlignVertical: 'top' },
  formInfo: { marginTop: 10, minHeight: 50, borderWidth: 1, borderColor: colors.line, borderRadius: 19, backgroundColor: '#fff', paddingHorizontal: 13, justifyContent: 'center' },
  formInfoTitle: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  formInfoValue: { marginTop: 3, color: colors.ink, fontSize: 14, fontWeight: '800' },
  primary: { marginTop: 14, minHeight: 52, borderRadius: 20, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  toast: { position: 'absolute', left: 18, right: 18, bottom: 142, backgroundColor: colors.dark, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12 },
  toastText: { color: colors.paper, fontSize: 13, fontWeight: '800' }
});
