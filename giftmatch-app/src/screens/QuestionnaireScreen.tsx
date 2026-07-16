import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";
import { RootStackParamList } from "../navigation/types";
import { useQuiz } from "../context/QuizContext";
import { ProgressBar } from "../components/ProgressBar";
import { GradientButton } from "../components/GradientButton";
import { SingleSelectQuestion } from "../components/steps/SingleSelectQuestion";
import { MultiSelectQuestion } from "../components/steps/MultiSelectQuestion";
import { TextQuestion } from "../components/steps/TextQuestion";
import {
  ageOptions,
  alreadyHasOptions,
  budgetOptions,
  giftTypeOptions,
  passionOptions,
  reactionOptions,
  relationOptions,
  styleOptions,
} from "../data/questions";
import { colors, spacing, typography } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Questionnaire">;

const TOTAL_STEPS = 9;

export function QuestionnaireScreen({ navigation }: Props) {
  const { answers, updateAnswers } = useQuiz();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const goNext = () => {
    if (step === TOTAL_STEPS - 1) {
      navigation.navigate("Analysis");
      return;
    }
    setDirection("forward");
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }
    setDirection("backward");
    setStep((s) => s - 1);
  };

  const isValid = (() => {
    switch (step) {
      case 0:
        return !!answers.relation;
      case 1:
        return !!answers.ageGroup;
      case 2:
        return !!answers.budget;
      case 3:
        return answers.passions.length > 0;
      case 4:
        return !!answers.style;
      case 5:
        return !!answers.giftType;
      case 6:
        return !!answers.reaction;
      case 7:
        return answers.alreadyHas.length > 0;
      case 8:
        return true;
      default:
        return false;
    }
  })();

  const titles = [
    "À qui veux-tu offrir ce cadeau ?",
    "Quel âge a cette personne ?",
    "Quel est ton budget ?",
    "Comment cette personne aime passer son temps ?",
    "Quel style correspond le mieux à cette personne ?",
    "Quel genre de cadeau ferait vraiment mouche ?",
    "Quelle réaction veux-tu provoquer ?",
    "Qu'est-ce qu'il/elle possède déjà beaucoup ?",
    "Un dernier détail ?",
  ];

  const subtitles: (string | undefined)[] = [
    undefined,
    undefined,
    undefined,
    "Sélectionne autant de réponses que nécessaire.",
    undefined,
    undefined,
    undefined,
    "Objectif : éviter les cadeaux inutiles.",
    "Dis-nous un détail qui pourrait nous aider.",
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <SingleSelectQuestion
            options={relationOptions}
            value={answers.relation}
            onSelect={(relation) => updateAnswers({ relation })}
          />
        );
      case 1:
        return (
          <SingleSelectQuestion
            options={ageOptions}
            value={answers.ageGroup}
            onSelect={(ageGroup) => updateAnswers({ ageGroup })}
          />
        );
      case 2:
        return (
          <SingleSelectQuestion
            options={budgetOptions}
            value={answers.budget}
            onSelect={(budget) => updateAnswers({ budget })}
          />
        );
      case 3:
        return (
          <MultiSelectQuestion
            options={passionOptions}
            values={answers.passions}
            onToggle={(passion) =>
              updateAnswers({
                passions: answers.passions.includes(passion)
                  ? answers.passions.filter((p) => p !== passion)
                  : [...answers.passions, passion],
              })
            }
          />
        );
      case 4:
        return (
          <SingleSelectQuestion
            options={styleOptions}
            value={answers.style}
            onSelect={(style) => updateAnswers({ style })}
            withSubtitles
          />
        );
      case 5:
        return (
          <SingleSelectQuestion
            options={giftTypeOptions}
            value={answers.giftType}
            onSelect={(giftType) => updateAnswers({ giftType })}
          />
        );
      case 6:
        return (
          <SingleSelectQuestion
            options={reactionOptions}
            value={answers.reaction}
            onSelect={(reaction) => updateAnswers({ reaction })}
          />
        );
      case 7:
        return (
          <MultiSelectQuestion
            options={alreadyHasOptions}
            values={answers.alreadyHas}
            onToggle={(item) =>
              updateAnswers({
                alreadyHas: answers.alreadyHas.includes(item)
                  ? answers.alreadyHas.filter((a) => a !== item)
                  : [...answers.alreadyHas, item],
              })
            }
          />
        );
      case 8:
        return (
          <TextQuestion
            value={answers.detail ?? ""}
            onChange={(detail) => updateAnswers({ detail })}
            placeholder="Ex : Il vient d'acheter une maison..."
            examples={[
              "Il vient d'acheter une maison",
              "Elle adore Harry Potter",
              "Il rêve de voyager au Japon",
            ]}
            multiline
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={goBack} hitSlop={12} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <View style={styles.progressWrap}>
            <ProgressBar progress={(step + 1) / TOTAL_STEPS} />
          </View>
          <Text style={styles.stepCount}>
            {step + 1}/{TOTAL_STEPS}
          </Text>
        </View>

        <Animated.View
          key={step}
          entering={direction === "forward" ? SlideInRight.duration(280) : SlideInLeft.duration(280)}
          style={styles.body}
        >
          <Text style={[typography.h2, styles.title]}>{titles[step]}</Text>
          {subtitles[step] ? <Text style={styles.subtitle}>{subtitles[step]}</Text> : null}
          <View style={styles.questionArea}>{renderStep()}</View>
        </Animated.View>

        <View style={styles.footer}>
          <GradientButton
            label={step === TOTAL_STEPS - 1 ? "✨ Voir mes cadeaux" : "Continuer"}
            onPress={goNext}
            disabled={!isValid}
            size="medium"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1, paddingHorizontal: spacing.lg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  backText: { color: colors.text, fontSize: 18 },
  progressWrap: { flex: 1 },
  stepCount: {
    color: colors.textDim,
    marginLeft: spacing.md,
    fontSize: 13,
    fontWeight: "600",
  },
  body: { flex: 1 },
  title: {
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textMuted,
    marginBottom: spacing.md,
    fontSize: 14,
  },
  questionArea: {
    flex: 1,
    marginTop: spacing.md,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems: "stretch",
  },
});
